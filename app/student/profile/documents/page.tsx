import { UploadResume } from "@/src/components/StudentProfile/UploadResume";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "My Documents | Student Portal",
  description: "Manage your resumes and supporting documents for internship applications.",
};

export default function DocumentsPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 -top-28 size-80 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute right-0 top-0 size-96 rounded-full bg-indigo-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <nav aria-label="Profile navigation">
          <Link
            href="/student/profile"
            className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-semibold text-slate-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/25"
          >
            <ArrowLeft className="size-4" />
            Back to profile
          </Link>
        </nav>

        <header className="relative mt-5 overflow-hidden rounded-3xl bg-[#071b33] px-6 py-7 text-white shadow-[0_20px_55px_rgba(7,27,51,0.18)] sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/20 blur-2xl" aria-hidden="true" />
          <div className="absolute -bottom-28 right-28 size-64 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <Sparkles className="size-3.5" />
              Application toolkit
            </div>
            <div className="mt-5 flex items-start gap-4">
              <div className="hidden size-13 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 sm:grid">
                <FileText className="size-6 text-blue-200" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Your application documents
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Keep polished resumes and supporting documents ready, then choose the default file recruiters receive with your applications.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-2.5 text-sm sm:grid-cols-3">
              <HeroFact icon={<FileCheck2 className="size-4" />} text="PDF, DOC and DOCX" />
              <HeroFact icon={<ShieldCheck className="size-4" />} text="Up to 5 MB per file" />
              <HeroFact icon={<CheckCircle2 className="size-4" />} text="One default document" />
            </div>
          </div>
        </header>

        <main className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <UploadResume />

          <aside className="space-y-4 lg:sticky lg:top-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <FileCheck2 className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Quick checklist</p>
                  <h2 className="mt-0.5 font-bold text-slate-900">Application ready</h2>
                </div>
              </div>
              <ol className="mt-5 space-y-4">
                <ChecklistItem number="1" text="Use a clear, professional filename." />
                <ChecklistItem number="2" text="Keep your experience and contact details current." />
                <ChecklistItem number="3" text="Mark your strongest resume as the default." />
              </ol>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 text-blue-950">
              <div className="flex items-center gap-2 font-bold">
                <LockKeyhole className="size-4 text-blue-700" />
                Your documents stay protected
              </div>
              <p className="mt-2 text-xs leading-5 text-blue-800/80">
                Files stay in your student workspace and are shared with recruiters through your internship applications.
              </p>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

function HeroFact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] px-3.5 py-3 text-slate-200 backdrop-blur-sm">
      <span className="text-blue-300">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function ChecklistItem({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex gap-3 text-sm leading-5 text-slate-600">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
        {number}
      </span>
      <span>{text}</span>
    </li>
  );
}
