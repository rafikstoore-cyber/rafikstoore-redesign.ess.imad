export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="border-b border-line bg-white">
        <div className="container-page py-10">
          <div className="skeleton h-4 w-40" />
          <div className="skeleton mt-5 h-8 w-72" />
          <div className="skeleton mt-3 h-4 w-96 max-w-full" />
        </div>
      </div>
      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="skeleton aspect-square rounded-none" />
              <div className="space-y-2.5 p-4">
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-24" />
                <div className="flex items-center justify-between pt-3">
                  <div className="skeleton h-5 w-16" />
                  <div className="skeleton h-10 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
