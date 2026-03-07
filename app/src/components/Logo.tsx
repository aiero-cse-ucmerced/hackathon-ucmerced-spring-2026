import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#171717]" aria-hidden>
        <span className="h-3 w-3 rounded bg-zinc-400" />
      </span>
      <span className="text-xl font-bold tracking-tight text-zinc-900">
        UncookedAura
      </span>
    </Link>
  );
}
