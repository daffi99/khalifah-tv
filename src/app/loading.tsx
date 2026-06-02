import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-muted/20 flex justify-center w-full">
      <div className="w-full bg-white relative flex flex-col min-h-screen overflow-hidden">
        {/* Fake Header */}
        <div className="h-16 bg-white border-b border-border/40 flex items-center px-4 shrink-0 shadow-sm animate-pulse">
          <div className="h-8 w-32 bg-muted rounded-full"></div>
          <div className="ml-auto h-10 w-10 bg-muted rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col flex-1 h-screen overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Categories Bar */}
            <div className="bg-white py-4 px-4 border-b border-border/40 animate-pulse flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-24 bg-muted rounded-full shrink-0"></div>
              ))}
            </div>

            {/* Video Feed Skeleton */}
            <div className="flex-1 overflow-y-auto bg-muted/10 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-4 flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
