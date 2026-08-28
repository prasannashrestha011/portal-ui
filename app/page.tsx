import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Student Job Portal | Start your career with confidence",
  description:
    "Discover internships and early-career opportunities, build a standout profile, and connect with employers looking for emerging talent.",
};

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discover the right role",
    description:
      "Explore internships and early-career opportunities that match your interests, skills, and goals.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Tell your whole story",
    description:
      "Bring your education, projects, skills, links, and resume together in one polished student profile.",
  },
  {
    icon: UserRoundCheck,
    number: "03",
    title: "Apply with confidence",
    description:
      "Send focused applications, track every decision, and keep your next step moving forward.",
  },
];

const categories = [
  "Software & technology",
  "Business & marketing",
  "Design & creative",
  "Finance & operations",
];

const profileHighlights = [
  "Keep your education, skills, and links in one place",
  "Upload a default resume for faster applications",
  "Track pending, accepted, and rejected applications",
];

const employerHighlights = [
  "Publish clear, student-friendly internships",
  "Review candidate profiles and resumes in one place",
  "Make decisions with a simple, focused workflow",
];

function Brand() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
        <BriefcaseBusiness className="size-5" aria-hidden="true" />
      </span>
      <span className="text-base font-extrabold tracking-tight text-text-primary sm:text-lg">
        Student Job Portal
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-text-primary">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" aria-label="Student Job Portal home">
            <Brand />
          </Link>

          <nav
            className="hidden items-center gap-8 text-sm font-semibold text-text-secondary lg:flex"
            aria-label="Main navigation"
          >
            <Link className="transition-colors hover:text-primary" href="/internships">
              Find internships
            </Link>
            <a className="transition-colors hover:text-primary" href="#how-it-works">
              How it works
            </a>
            <a className="transition-colors hover:text-primary" href="#for-employers">
              For employers
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-bold text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary sm:px-4"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover sm:px-4"
            >
              <span className="hidden sm:inline">Get started</span>
              <span className="sm:hidden">Join</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative bg-background">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary-subtle/80 to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-subtle px-3.5 py-2 text-sm font-bold text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              Built for ambitious beginnings
            </div>
            <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-[-0.055em] text-text-primary sm:text-6xl lg:text-7xl">
              Your career deserves a{" "}
              <span className="text-primary">strong start.</span>
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-text-secondary sm:text-xl">
              Find meaningful internships, present your potential, and connect
              with employers who are ready to invest in emerging talent.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/internships"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Explore internships
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border-strong bg-surface px-5 py-3.5 text-sm font-bold text-text-primary transition-colors hover:border-primary/40 hover:bg-primary-subtle"
              >
                Create a free profile
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-text-muted">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                Student-first opportunities
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                Simple application tracking
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:justify-self-end">
            <div
              className="absolute -left-8 -top-8 size-36 rounded-full bg-primary/15 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-10 -right-8 size-44 rounded-full bg-accent/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative rounded-[2rem] border border-border bg-surface p-2.5 shadow-2xl shadow-primary/10 sm:rounded-[2.5rem] sm:p-3.5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.55rem] sm:rounded-[2rem]">
                <Image
                  src="/landing-page/colloboration.jpg"
                  alt="A diverse team collaborating around a table with laptops"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 54vw"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 left-5 right-5 rounded-2xl border border-border bg-surface/95 p-4 shadow-xl shadow-primary/10 backdrop-blur sm:left-8 sm:right-auto sm:w-80 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-subtle text-success">
                  <BadgeCheck className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-text-primary">
                    One profile. Your whole potential.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    Skills, education, links, and resume—ready when opportunity
                    arrives.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-full border border-border bg-surface/95 px-3.5 py-2 text-xs font-bold text-text-secondary shadow-lg backdrop-blur sm:flex">
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
              Student-ready roles
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface/80 px-5 py-5 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <p className="shrink-0 text-xs font-extrabold uppercase tracking-[0.18em] text-text-muted">
              Explore opportunities across
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-text-secondary lg:justify-end">
              {categories.map((category) => (
                <span key={category} className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
            A clearer path forward
          </p>
          <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl">
            From searching to starting, all in one place.
          </h2>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Spend less time managing the process and more time preparing for
            the opportunity that matters.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:p-8"
              >
                <span className="absolute right-6 top-5 font-mono text-5xl font-black text-primary/10">
                  {step.number}
                </span>
                <span className="grid size-13 place-items-center rounded-2xl bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-8 text-xl font-extrabold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-text-secondary">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-surface p-2.5 shadow-2xl shadow-primary/10">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.55rem]">
                <Image
                  src="/landing-page/laptop.jpg"
                  alt="A laptop displaying a software project"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="absolute -bottom-7 right-4 max-w-64 rounded-2xl border border-border bg-surface p-4 shadow-xl sm:right-7">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-subtle text-primary">
                  <Target className="size-4" aria-hidden="true" />
                </span>
                <p className="text-sm font-bold leading-5 text-text-primary">
                  Your work and skills deserve to be seen.
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
              More than a resume
            </p>
            <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl">
              Build a profile that shows what you can become.
            </h2>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              Early in your career, potential matters. Give employers a clear
              view of your education, projects, interests, and the skills
              you&apos;re building.
            </p>
            <ul className="mt-8 space-y-4">
              {profileHighlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-sm font-semibold leading-6 text-text-secondary"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success-subtle text-success">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-9 inline-flex items-center gap-2 text-sm font-extrabold text-primary transition-colors hover:text-primary-hover"
            >
              Start building your profile
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="for-employers"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="overflow-hidden rounded-[2rem] border border-primary/20 bg-primary-subtle text-text-primary shadow-2xl shadow-primary/10 lg:grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-surface/70 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              <Building2 className="size-4" aria-hidden="true" />
              For employers
            </div>
            <h2 className="mt-6 text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Find the people who will grow with your team.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
              Reach motivated students and fresh graduates, understand their
              potential, and keep every application organized.
            </p>
            <ul className="mt-7 space-y-3">
              {employerHighlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-sm font-semibold text-text-secondary"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-9 inline-flex w-fit items-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Start hiring emerging talent
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative min-h-80 lg:min-h-full">
            <Image
              src="/landing-page/coding.jpg"
              alt="A software team working together in a modern office"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-border/40 bg-surface/95 p-4 text-text-primary shadow-xl backdrop-blur sm:bottom-7 sm:left-7 sm:right-auto sm:w-72">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-subtle text-primary">
                  <UsersRound className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold">Human potential, clearly presented</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Review profiles, documents, and decisions together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-5 py-18 text-center sm:px-8 sm:py-24">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <GraduationCap className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-balance text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl">
            Your next chapter can start today.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
            Create your profile, discover opportunities, and take the first
            confident step toward work that matters to you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              Create your free account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/internships"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-surface px-5 py-3.5 text-sm font-extrabold text-primary transition-colors hover:bg-surface-hover"
            >
              Browse internships
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-8 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
            <Brand />
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-text-muted">
              <Link className="transition-colors hover:text-primary" href="/internships">
                Find internships
              </Link>
              <a className="transition-colors hover:text-primary" href="#how-it-works">
                How it works
              </a>
              <a className="transition-colors hover:text-primary" href="#for-employers">
                For employers
              </a>
              <Link className="transition-colors hover:text-primary" href="/login">
                Log in
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>Helping emerging talent take a confident next step.</p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" aria-hidden="true" />
              Profiles and applications, kept together.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
