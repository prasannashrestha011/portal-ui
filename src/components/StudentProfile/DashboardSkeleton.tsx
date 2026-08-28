

// Dashboard Skeleton Loader
export function DashboardSkeleton() {
    return (
        <div className="mx-auto max-w-7xl p-8 space-y-6 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-lg w-48" />
            <div className="h-24 bg-blue-100/50 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 bg-slate-200 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-72 bg-slate-200 rounded-xl" />
                <div className="h-72 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}