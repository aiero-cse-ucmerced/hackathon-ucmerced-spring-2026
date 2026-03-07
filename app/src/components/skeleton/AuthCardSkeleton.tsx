import { Skeleton } from "@/components/ui/skeleton";

export function AuthCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

