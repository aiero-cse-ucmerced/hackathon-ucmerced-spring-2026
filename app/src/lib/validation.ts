/**
 * Input validation utilities for form security.
 * Per Sucuri: validate on client and server, never trust user input,
 * reject invalid data rather than sanitizing when possible.
 * @see https://blog.sucuri.net/2024/07/input-validation-for-website-security.html
 */

/** Max lengths to prevent DoS and overflow. */
export const LIMITS = {
  EMAIL_MAX: 254,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  NAME_MAX: 100,
  DISPLAY_TEXT_MAX: 2000,
  PAST_EXPERIENCE_ITEM_MAX: 200,
  AVATAR_MAX_BYTES: 2 * 1024 * 1024, // 2MB
  RESUME_MAX_BYTES: 5 * 1024 * 1024, // 5MB for PDF/DOC
} as const;

/** Allowed image MIME types for avatar upload. */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

/**
 * Validates email format (RFC 5322 simplified).
 * Rejects empty, malformed, or overlong addresses.
 */
export function isValidEmail(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed || trimmed.length > LIMITS.EMAIL_MAX) return false;
  const at = trimmed.indexOf("@");
  if (at <= 0 || at === trimmed.length - 1) return false;
  const domain = trimmed.slice(at + 1);
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith("."))
    return false;
  // Reject path traversal, control chars, obvious injection
  if (/[<>'"\\;]|\/\*|\*\/|\x00-\x1f/.test(trimmed)) return false;
  return true;
}

/**
 * Validates password: length and optional complexity.
 * Complexity: at least one letter and one number (per common guidance).
 */
export function isValidPassword(
  value: string,
  options?: { requireComplexity?: boolean }
): { valid: boolean; message?: string } {
  if (!value || value.length < LIMITS.PASSWORD_MIN) {
    return {
      valid: false,
      message: `Password must be at least ${LIMITS.PASSWORD_MIN} characters.`,
    };
  }
  if (value.length > LIMITS.PASSWORD_MAX) {
    return {
      valid: false,
      message: `Password must be no more than ${LIMITS.PASSWORD_MAX} characters.`,
    };
  }
  if (options?.requireComplexity) {
    if (!/[a-zA-Z]/.test(value)) {
      return {
        valid: false,
        message: "Password must contain at least one letter.",
      };
    }
    if (!/\d/.test(value)) {
      return {
        valid: false,
        message: "Password must contain at least one number.",
      };
    }
  }
  return { valid: true };
}

/**
 * Sanitizes display name: trims, limits length, rejects dangerous chars.
 * Use for name, profile text that will be displayed.
 */
export function sanitizeDisplayName(value: string, maxLen = LIMITS.NAME_MAX): string {
  const trimmed = value.trim().slice(0, maxLen);
  // Remove control chars and obvious XSS vectors
  return trimmed.replace(/[\x00-\x1f<>"']/g, "");
}

/**
 * Validates display name: non-empty, within length, no dangerous chars.
 */
export function isValidDisplayName(value: string): { valid: boolean; message?: string } {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Name is required." };
  if (trimmed.length > LIMITS.NAME_MAX) {
    return { valid: false, message: `Name must be no more than ${LIMITS.NAME_MAX} characters.` };
  }
  if (/[<>"']/.test(trimmed)) {
    return { valid: false, message: "Name contains invalid characters." };
  }
  return { valid: true };
}

/**
 * Sanitizes free-text (e.g. past experiences): trims items, limits length per item.
 */
export function sanitizePastExperiences(items: string[]): string[] {
  return items
    .map((s) => s.trim().slice(0, LIMITS.PAST_EXPERIENCE_ITEM_MAX))
    .filter(Boolean)
    .map((s) => s.replace(/[\x00-\x1f<>"']/g, ""))
    .slice(0, 50); // max 50 items
}

/**
 * Validates avatar file: type, size.
 */
export function isValidAvatarFile(file: File): { valid: boolean; message?: string } {
  if (!file || !file.type) return { valid: false, message: "No file selected." };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      valid: false,
      message: "Please upload a JPG, PNG, GIF, or WebP image.",
    };
  }
  if (file.size > LIMITS.AVATAR_MAX_BYTES) {
    return {
      valid: false,
      message: `Image must be under ${LIMITS.AVATAR_MAX_BYTES / 1024 / 1024}MB.`,
    };
  }
  return { valid: true };
}

/** Allowed MIME types for resume upload (PDF, Word). */
export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
] as const;

/**
 * Validates resume file: type, size.
 * Used for onboarding upload; content can be sent to Gemini for personalized tips.
 */
export function isValidResumeFile(file: File): { valid: boolean; message?: string } {
  if (!file || !file.type) return { valid: false, message: "No file selected." };
  if (!ALLOWED_RESUME_TYPES.includes(file.type as (typeof ALLOWED_RESUME_TYPES)[number])) {
    return {
      valid: false,
      message: "Please upload a PDF or Word document (.pdf, .doc, .docx).",
    };
  }
  if (file.size > LIMITS.RESUME_MAX_BYTES) {
    return {
      valid: false,
      message: `Resume must be under ${LIMITS.RESUME_MAX_BYTES / 1024 / 1024}MB.`,
    };
  }
  return { valid: true };
}
