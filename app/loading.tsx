// app/saidas/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-31.25 w-62.5 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-75" /> {/* Title */}
        <Skeleton className="h-6 w-50" />  {/* Subtitle */}
      </div>
      <div className="mt-10">
        <Skeleton className="h-100 w-full rounded-md" /> {/* Table Skeleton */}
      </div>
    </div>
  );
}