// app/saidas/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-[300px]" /> {/* Title */}
        <Skeleton className="h-6 w-[200px]" />  {/* Subtitle */}
      </div>
      <div className="mt-10">
        <Skeleton className="h-[400px] w-full rounded-md" /> {/* Table Skeleton */}
      </div>
    </div>
  );
}