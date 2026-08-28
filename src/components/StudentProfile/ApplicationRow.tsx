
function ApplicationRow({
    role,
    company,
    location,
    date,
    status,
    variant,
}: {
    role: string;
    company: string;
    location: string;
    date: string;
    status: string;
    variant: "warning" | "info" | "default";
}) {
    const badgeStyles = {
        warning: "bg-amber-50 text-amber-800 border-amber-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
        default: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <div className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
            <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">{role}</h4>
                <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{company}</span> • {location}
                </p>
                <p className="text-[11px] text-slate-400">{date}</p>
            </div>
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${badgeStyles[variant]}`}>
                {status}
            </span>
        </div>
    );
}