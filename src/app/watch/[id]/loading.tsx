import { Loader2 } from "lucide-react";

export default function WatchLoading() {
  return (
    <main className="min-h-screen bg-black/95 flex justify-center w-full">
      <div className="w-full bg-white relative flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* Left Column (Video Player + Info) */}
        <div className="w-full lg:w-[65%] xl:w-[70%] flex flex-col shrink-0 border-r border-border/40 bg-white">
          <div className="w-full bg-black aspect-video flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="px-4 py-4 animate-pulse">
            <div className="h-6 bg-muted w-3/4 rounded mb-4"></div>
            <div className="h-4 bg-muted w-1/4 rounded mb-6"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted w-32 rounded mb-2"></div>
                <div className="h-3 bg-muted w-24 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Related Feed) */}
        <div className="flex-1 flex flex-col min-h-0 bg-muted/10">
          <div className="bg-white py-4 px-4 border-b border-border/40 animate-pulse flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-20 bg-muted rounded-full shrink-0"></div>
            ))}
          </div>
          <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-32 h-20 bg-muted rounded-xl shrink-0"></div>
                <div className="flex-1 py-1">
                  <div className="h-4 bg-muted w-full rounded mb-2"></div>
                  <div className="h-3 bg-muted w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
