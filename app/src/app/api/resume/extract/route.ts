/**
 * POST /api/resume/extract
 * Accepts resume (base64) and uses Gemini to extract past experiences.
 * Returns { pastExperiences: string[], tips?: string[] } for profile prefill.
 * Rate limited: 10 requests per 15 min per IP.
 */

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const ALLOWED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

const MAX_BASE64_LEN = 7_000_000; // ~5MB base64

export async function POST(request: Request) {
  const { max, windowMs } = RATE_LIMITS.resumeExtract;
  const { allowed, resetAt } = checkRateLimit(
    request,
    "resume-extract",
    max,
    windowMs
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Resume extraction not configured. Set GOOGLE_GENERATIVE_AI_API_KEY." },
      { status: 503 }
    );
  }

  let body: { base64?: string; mimeType?: string };
  try {
    body = (await request.json()) as { base64?: string; mimeType?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const base64 = body.base64?.trim();
  const mimeType = body.mimeType?.trim() || "application/pdf";

  if (!base64 || base64.length > MAX_BASE64_LEN) {
    return NextResponse.json(
      { error: "Resume base64 required and must be under 5MB" },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIMES.includes(mimeType as (typeof ALLOWED_MIMES)[number])) {
    return NextResponse.json(
      { error: "Only PDF or Word documents are supported" },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are extracting work experience and past roles from a resume/CV document (either PDF or extracted text).

Extract ALL past experiences as a JSON array of short strings. Each string should be a concise description of one role, project, or activity (e.g. "Software Intern at Acme Corp", "Treasurer of Campus Coding Club", "Led class project on data visualization").

Return ONLY valid JSON in this exact format:
{"pastExperiences": ["item1", "item2", ...], "tips": ["optional personalized internship tip 1", "optional tip 2"]}

The tips array should contain 0-3 brief, actionable tips for internship hunting based on the resume. Keep each tip under 80 characters.`;

    type ContentPart = { text: string } | { inlineData: { mimeType: string; data: string } };
    const parts: ContentPart[] = [];

    if (mimeType === "application/pdf") {
      parts.push({
        inlineData: { mimeType: "application/pdf", data: base64 },
      });
    } else if (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const buffer = Buffer.from(base64, "base64");
      const { default: mammoth } = await import("mammoth");
      const mammothResult = await mammoth.extractRawText({ buffer });
      const docText = mammothResult.value?.trim();
      if (!docText || docText.length < 50) {
        return NextResponse.json(
          { error: "Could not extract enough text from the document" },
          { status: 400 }
        );
      }
      parts.push({
        text: `Resume content:\n\n${docText.slice(0, 30000)}`,
      });
    } else {
      return NextResponse.json(
        { error: "Only PDF or Word documents are supported" },
        { status: 400 }
      );
    }

    parts.push({ text: prompt });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await model.generateContent(parts as any);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned no content" },
        { status: 502 }
      );
    }

    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned) as {
      pastExperiences?: string[];
      tips?: string[];
    };

    const pastExperiences = Array.isArray(parsed.pastExperiences)
      ? parsed.pastExperiences.filter((s) => typeof s === "string" && s.trim().length > 0)
      : [];
    const tips = Array.isArray(parsed.tips)
      ? parsed.tips.filter((s) => typeof s === "string" && s.trim().length > 0)
      : [];

    return NextResponse.json({ pastExperiences, tips });
  } catch (e) {
    console.error("[resume/extract]", e);
    const msg = e instanceof Error ? e.message : "Resume extraction failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
