import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  HeroBackground,
  LandingMotionRoot,
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/src/components/Landing/LandingMotion";
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

function Brand({ compactOnMobile = false }: { compactOnMobile?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 sm:size-10 sm:rounded-2xl">
        <BriefcaseBusiness className="size-5" aria-hidden="true" />
      </span>
      <span
        className={`${compactOnMobile ? "hidden sm:inline" : "inline"} text-base font-extrabold tracking-tight text-text-primary sm:text-lg`}
      >
        Student Job Portal
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <LandingMotionRoot className="min-h-screen overflow-hidden bg-background text-text-primary">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-2 px-3 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="shrink-0"
            aria-label="Student Job Portal home"
          >
            <Brand compactOnMobile />
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

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-2.5 py-2 text-sm font-bold text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary sm:px-4 sm:py-2.5"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover sm:gap-2 sm:px-4 sm:py-2.5"
            >
              <span className="hidden sm:inline">Get started</span>
              <span className="sm:hidden">Join</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative isolate flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden bg-background">
        <HeroBackground className="absolute inset-0 -z-30">
          <Image
            src="/landing-page/colloboration.jpg"
            alt=""
            fill
            preload
            className="object-cover object-[58%_center] sm:object-center"
            sizes="100vw"
          />
        </HeroBackground>

        <div className="relative mx-auto grid min-h-0 w-full max-w-7xl flex-1 items-center gap-10 px-4 py-12 sm:min-h-[42rem] sm:gap-14 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10 lg:py-24">
          <MotionReveal className="max-w-2xl" onLoad>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface/85 px-3 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-md sm:mb-6 sm:px-3.5 sm:text-sm">
              <Sparkles className="size-4" aria-hidden="true" />
              Built for ambitious beginnings
            </div>
            <h1 className="text-balance text-[2.65rem] font-black leading-[1.02] tracking-[-0.05em] text-text-inverse [text-shadow:0_2px_18px_var(--color-text-primary)] min-[390px]:text-5xl sm:text-6xl sm:leading-[0.98] sm:tracking-[-0.055em] lg:text-7xl">
              Your career deserves a{" "}
              <span className="text-accent-subtle">strong start.</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base font-medium leading-7 text-text-inverse [text-shadow:0_1px_10px_var(--color-text-primary)] sm:mt-7 sm:text-xl sm:leading-8">
              Find meaningful internships, present your potential, and connect
              with employers who are ready to invest in emerging talent.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link
                href="/internships"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Explore internships
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border-strong bg-surface/90 px-5 py-3.5 text-sm font-bold text-text-primary shadow-sm backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-primary-subtle"
              >
                Create a free profile
              </Link>
            </div>

            <div className="mt-6 flex flex-col items-start gap-3 text-xs font-semibold text-text-inverse [text-shadow:0_1px_8px_var(--color-text-primary)] sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-success-subtle"
                  aria-hidden="true"
                />
                Student-first opportunities
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-success-subtle"
                  aria-hidden="true"
                />
                Simple application tracking
              </span>
            </div>
          </MotionReveal>

          <MotionReveal
            className="relative hidden min-h-[30rem] lg:block"
            delay={0.35}
            onLoad
          >
            <div className="absolute right-0 top-10 flex items-center gap-2 rounded-full border border-surface/60 bg-surface/90 px-4 py-2.5 text-xs font-bold text-text-secondary shadow-xl backdrop-blur-md">
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
              Student-ready roles
            </div>

            <div className="absolute bottom-8 right-4 w-80 rounded-2xl border border-surface/60 bg-surface/90 p-5 shadow-2xl shadow-primary/10 backdrop-blur-md">
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
          </MotionReveal>
        </div>

        <MotionReveal className="mx-auto w-full max-w-7xl shrink-0 px-4 pb-5 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/80 px-4 py-4 shadow-sm backdrop-blur sm:px-5 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <p className="shrink-0 text-xs font-extrabold uppercase tracking-[0.18em] text-text-muted">
              Explore opportunities across
            </p>
            <div className="grid gap-3 text-xs font-bold text-text-secondary min-[480px]:grid-cols-2 sm:text-sm lg:flex lg:flex-wrap lg:gap-x-6 lg:justify-end">
              {categories.map((category) => (
                <span key={category} className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {category}
                </span>
              ))}
            </div>
          </div>
        </MotionReveal>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <MotionReveal className="mx-auto max-w-3xl text-center">
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
        </MotionReveal>

        <MotionStagger className="mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <MotionStaggerItem key={step.title} className="h-full">
                <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:p-8">
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
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <MotionReveal className="relative order-2 lg:order-1">
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
          </MotionReveal>

          <MotionReveal className="order-1 lg:order-2" delay={0.1}>
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
          </MotionReveal>
        </div>
      </section>

      <section
        id="for-employers"
        className="relative isolate scroll-mt-24 overflow-hidden border-y border-primary/20 bg-primary-subtle"
      >
        <Image
          src="/landing-page/coding.jpg"
          alt=""
          fill
          className="-z-30 object-cover object-[center_45%]"
          sizes="100vw"
        />

        <MotionReveal className="relative mx-auto grid min-h-[42rem] w-full max-w-7xl px-5 text-text-inverse sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
            <div className="flex flex-col justify-center py-20 lg:py-28 lg:pr-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-surface/70 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                <Building2 className="size-4" aria-hidden="true" />
                For employers
              </div>
              <h2 className="mt-6 text-balance text-3xl font-black tracking-[-0.04em] [text-shadow:0_2px_18px_var(--color-text-primary)] sm:text-4xl lg:text-5xl">
                Find the people who will grow with your team.
              </h2>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-text-inverse [text-shadow:0_1px_10px_var(--color-text-primary)] sm:text-lg sm:leading-8">
                Reach motivated students and fresh graduates, understand their
                potential, and keep every application organized.
              </p>
              <ul className="mt-7 space-y-3">
                {employerHighlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm font-semibold text-text-inverse [text-shadow:0_1px_8px_var(--color-text-primary)]"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-success-subtle"
                      aria-hidden="true"
                    />
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

            <div className="relative min-h-56 pb-20 lg:min-h-full lg:pb-0">
              <div className="absolute bottom-10 left-0 right-0 rounded-2xl border border-border/40 bg-surface/90 p-4 text-text-primary shadow-xl backdrop-blur-md sm:left-auto sm:right-0 sm:w-72 lg:bottom-12">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-subtle text-primary">
                    <UsersRound className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold">
                      Human potential, clearly presented
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Review profiles, documents, and decisions together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </MotionReveal>
      </section>

      <section className="border-y border-border bg-secondary">
        <MotionReveal className="mx-auto flex max-w-5xl flex-col items-center px-5 py-18 text-center sm:px-8 sm:py-24">
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
        </MotionReveal>
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
    </LandingMotionRoot>
  );
}
