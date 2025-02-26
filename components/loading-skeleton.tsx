import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
          </div>
        </header>

        <div className="grid lg:grid-cols-[350px,1fr] gap-8">
          {/* Sidebar Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="rounded-xl border bg-card">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-4 space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <div className="ml-4 space-y-2">
                      <Skeleton className="h-5 w-5/6" />
                      <Skeleton className="h-5 w-4/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="space-y-8">
            {/* Player Skeleton */}
            <div className="rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="size-12 rounded-xl" />
                  <Skeleton className="size-9 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="h-2 w-24 rounded-full" />
                </div>
              </div>
            </div>

            {/* Track Grid Skeleton */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border bg-card space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

