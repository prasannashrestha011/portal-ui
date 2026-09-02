import Link from "next/link";


// Presence Link Item
export default function PresenceLinkItem({ label, url, icon }: { label: string; url?: string; icon?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <section className="flex items-center gap-2">
                {icon}
                <span className="font-medium text-slate-600">{label}</span>
            </section>
            {url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[150px]"
                >
                    {url.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
            ) : (
                <Link href="/student/profile/upsert" className="text-slate-400 hover:text-blue-600 transition-colors">
                    + Add Link
                </Link>
            )}
        </div>
    );
}
