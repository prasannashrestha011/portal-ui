import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronRight, GraduationCap, Search, Sparkles, Users } from "lucide-react"

const steps = [
  { icon: Search, title: "Find your fit", description: "Explore opportunities curated for students, fresh graduates, and early-career talent." },
  { icon: GraduationCap, title: "Show your strengths", description: "Create a profile that puts your education, skills, and ambition in one clear place." },
  { icon: Users, title: "Meet the right teams", description: "Connect with employers who are looking for the next generation of builders." },
]

const jobs = [
  { role: "Product Design Intern", company: "Northstar Labs", type: "Internship", color: "bg-blue-100 text-blue-700" },
  { role: "Junior Frontend Developer", company: "Brightside Studio", type: "Full-time", color: "bg-emerald-100 text-emerald-700" },
  { role: "Campus Marketing Associate", company: "Fieldwork", type: "Part-time", color: "bg-amber-100 text-amber-700" },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Portal home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"><BriefcaseBusiness className="size-5" aria-hidden="true" /></span>
            <span className="text-lg font-bold tracking-tight text-slate-900">Portal</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
            <a href="#how-it-works" className="transition hover:text-blue-600">How it works</a>
            <a href="#for-employers" className="transition hover:text-blue-600">For employers</a>
          </nav>
          <div className="flex items-center gap-2.5"><Link href="/login" className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Log in</Link><Link href="/register" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Get started</Link></div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700"><Sparkles className="size-4" aria-hidden="true" />Your next opportunity starts here</div>
            <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">Build a career that feels like <span className="text-blue-600">you.</span></h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">A simpler way for students and new graduates to discover meaningful work, show what they can do, and take the first step with confidence.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Create your profile <ArrowRight className="size-4" aria-hidden="true" /></Link><Link href="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">I already have an account</Link></div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />Student-first opportunities</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />Free to get started</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:justify-self-end"><div className="absolute -right-10 -top-10 size-40 rounded-full bg-blue-100/70 blur-3xl" aria-hidden="true" /><div className="relative rounded-[2rem] border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-300/50 sm:p-6"><div className="flex items-center justify-between border-b border-slate-800 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Opportunity board</p><h2 className="mt-1 text-xl font-bold text-white">Made for your next move</h2></div><span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">Live now</span></div><div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-400"><Search className="size-4" aria-hidden="true" />Search roles, skills, or companies</div><div className="mt-4 flex flex-col gap-3">{jobs.map((job) => <div key={job.role} className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{job.role}</h3><p className="mt-1 text-sm text-slate-400">{job.company}</p></div><ChevronRight className="size-4 text-slate-500" aria-hidden="true" /></div><span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${job.color}`}>{job.type}</span></div>)}</div><div className="mt-4 flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3"><span className="text-sm font-semibold text-white">See opportunities matched to you</span><ArrowRight className="size-4 text-blue-100" aria-hidden="true" /></div></div></div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">A better starting point</p><h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Less noise. More momentum.</h2><p className="mt-4 text-lg leading-8 text-slate-600">Everything you need to move from “I’m looking” to “I’m ready.”</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{steps.map((step, index) => { const Icon = step.icon; return <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon className="size-6" aria-hidden="true" /></span><span className="font-mono text-sm font-bold text-slate-300">0{index + 1}</span></div><h3 className="mt-7 text-xl font-bold text-slate-900">{step.title}</h3><p className="mt-3 leading-7 text-slate-600">{step.description}</p></article> })}</div></section>

      <section id="for-employers" className="border-y border-slate-200 bg-blue-600"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">For employers</p><h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">Meet the people ready to make an impact.</h2><p className="mt-4 max-w-xl text-lg leading-8 text-blue-100">Share your opportunities with ambitious students and emerging talent.</p></div><Link href="/register" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Explore employer access <ArrowRight className="size-4" aria-hidden="true" /></Link></div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><div className="flex items-center gap-2 font-semibold text-slate-700"><BriefcaseBusiness className="size-4 text-blue-600" aria-hidden="true" />Portal</div><p>Helping students take their next step.</p></footer>
    </main>
  )
}
