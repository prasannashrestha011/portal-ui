
// Shadcn Metric Card with Blue Accents
export default function MetricCard({
    title,
    value,
    subtitle,
    icon,
    badge,
    tone = "blue",
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string;
    tone?: "blue" | "emerald" | "rose" | "amber";
}) {
    const toneStyles = {
        blue: "bg-blue-50 text-blue-700",
        emerald: "bg-emerald-50 text-emerald-700",
        rose: "bg-rose-50 text-rose-700",
        amber: "bg-amber-50 text-amber-700",
    };

    return (
        <div className="space-y-2 rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-2xs transition-colors hover:border-blue-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneStyles[tone]}`}>
                        {icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{title}</span>
                </div>
                {badge && (
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${toneStyles[tone]}`}>
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">{subtitle}</p>
            </div>
        </div>
    );
}
