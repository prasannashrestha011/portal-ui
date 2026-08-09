
/* Helpers */
const inputClassName =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900";

export function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </div>
    );
}

export function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="block text-xs font-medium text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input className={`${inputClassName} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea className={`${inputClassName} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select className={`${inputClassName} ${className}`} {...props} />;
}