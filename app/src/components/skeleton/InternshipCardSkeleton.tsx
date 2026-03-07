import { Skeleton } from "@/components/ui/skeleton";

export function InternshipCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2 h-3 w-24" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1 h-3 w-5/6" />
    </div>
  );
}

