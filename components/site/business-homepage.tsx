"use client";

import { motion } from "motion/react";
import {
  company,
  companyOverview,
  contactOptions,
  highlights,
  process,
  projects,
  reasons,
  sectors,
  services,
  stats,
} from "@/data/site-content";

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{text}</p>
    </div>
  );
}

function FloatingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.28),transparent_24%),linear-gradient(180deg,#f8fcff_0%,#eef7ff_46%,#ffffff_100%)]" />
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="absolute left-1/3 top-[28rem] h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
      <div className="hero-grid absolute inset-x-0 top-0 h-[44rem] opacity-50" />
      <motion.div
        className="absolute left-[10%] top-28 h-24 w-24 rounded-[2rem] border border-white/70 bg-white/70 shadow-xl shadow-sky-100"
        animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[12%] top-40 h-20 w-20 rounded-full border border-white/70 bg-gradient-to-br from-amber-200/80 to-white shadow-xl shadow-amber-100"
        animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-24 left-0 right-0 mx-auto h-28 w-[88%] max-w-5xl rounded-full bg-gradient-to-r from-sky-100 via-white to-amber-100 blur-2xl"
        animate={{ opacity: [0.6, 0.95, 0.6] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  );
}

function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-white/80 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="absolute inset-x-8 top-5 h-16 rounded-full bg-gradient-to-r from-sky-50 via-white to-amber-50" />
        <div className="relative rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                Highway and Industrial Signage
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                Boards built for safety, guidance, and compliance
              </h3>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 px-4 py-3 text-sm font-semibold text-slate-900">
              Since {company.since}
            </div>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-700 px-6 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.18),transparent_22%)]" />
            <div className="relative mx-auto flex max-w-md flex-col items-center">
              <div className="w-full rounded-[1.5rem] border-[10px] border-white bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    Reflective Sign
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-50">
                    Direction Ahead
                  </span>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sky-50">Industrial Access</p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
                      Zone B
                    </p>
                  </div>
                  <div className="relative h-4 w-28 rounded-full bg-white/90">
                    <span className="absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-r-[6px] border-t-[6px] border-white" />
                  </div>
                </div>
              </div>

              <div className="h-24 w-4 rounded-full bg-slate-200" />

              <div className="relative mt-2 h-40 w-full overflow-hidden rounded-[2rem] bg-slate-800">
                <motion.div
                  className="absolute left-[8%] right-[8%] top-1/2 h-16 -translate-y-1/2 rounded-[2rem] bg-slate-700"
                  animate={{ scaleX: [1, 1.02, 1] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute left-[16%] top-1/2 h-2 w-40 -translate-y-1/2 rounded-full bg-amber-300"
                  animate={{ x: ["-12%", "145%"] }}
                  transition={{
                    duration: 2.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              "Road regulatory and caution boards",
              "Factory hazard and PPE sign systems",
              "Custom structure fabrication and fitting",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm font-medium text-slate-600 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function BusinessHomepage() {
  return (
    <main className="relative overflow-hidden bg-white text-slate-900">
      <FloatingBackground />

      <header className="sticky top-0 z-30 border-b border-sky-100/80 bg-white/80 backdrop-blur-xl">
        <Container className="flex min-h-20 items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-sky-200">
              SP
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-sky-700 uppercase">
                {company.name}
              </p>
              <p className="text-xs text-slate-500">{company.tagline}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a href="#services" className="transition hover:text-sky-700">
              Services
            </a>
            <a href="#industries" className="transition hover:text-sky-700">
              Industries
            </a>
            <a href="#projects" className="transition hover:text-sky-700">
              Projects
            </a>
            <a href="/admin/login" className="transition hover:text-sky-700">
              Admin Login
            </a>
            <a href="#contact" className="transition hover:text-sky-700">
              Contact
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="/admin/login"
              className="rounded-full border border-cyan-200 bg-cyan-50 px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
            >
              Admin Login
            </a>
            <a
              href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
              className="rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-[-1px]"
            >
              WhatsApp Us
            </a>
          </div>
        </Container>
      </header>

      <section id="top" className="relative pt-12 sm:pt-16 lg:pt-20">
        <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Road Safety, Industrial Signage, and Work-Zone Solutions
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Reliable signboards for highways, factories, warehouses, and construction sites.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {company.name} designs, fabricates, and installs safety and
              directional signage that helps people move clearly and safely in
              high-traffic and high-risk environments.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-[-1px]"
              >
                Explore Services
              </a>
              <a
                href={`tel:${company.phone.replace(/\s+/g, "")}`}
                className="rounded-full border border-sky-200 bg-sky-50 px-6 py-3.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Call for Enquiry
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white bg-white/85 px-4 py-4 text-sm font-medium text-slate-700 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
                >
                  <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-amber-400 align-middle" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <HeroIllustration />
        </Container>
      </section>

      <section className="relative mt-14 sm:mt-20">
        <Container>
          <div className="grid gap-5 rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.06)] sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-6"
              >
                <p className="text-4xl font-semibold tracking-tight text-slate-950">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow="About the Company"
            title="A signage execution partner focused on safety, clarity, and long-term outdoor performance"
            text="The website copy now speaks more directly about the actual business: sign design, reflective fabrication, structure work, and site installation for roads and industrial environments."
          />

          <div className="grid gap-4">
            {companyOverview.map((item) => (
              <div
                key={item}
                className="rounded-[1.75rem] border border-sky-100 bg-white px-6 py-5 text-base leading-8 text-slate-600 shadow-[0_18px_60px_rgba(15,23,42,0.05)]"
              >
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="industries" className="pb-20 sm:pb-24">
        <Container>
          <SectionTitle
            eyebrow="Industries We Serve"
            title="Solutions prepared for public roads, industrial spaces, and active project sites"
            text="Each category is built around how people actually move through the site, what warnings they need to see, and how long the signage must perform outdoors."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {sectors.map((sector, index) => (
              <motion.article
                key={sector.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group rounded-[2rem] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(14,165,233,0.12)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 text-lg font-semibold text-sky-700">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                  {sector.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {sector.description}
                </p>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="services"
        className="border-y border-sky-100 bg-gradient-to-b from-sky-50/80 to-white py-20 sm:py-24"
      >
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow="Core Services"
            title="From planning and production to installation at site"
            text="These service blocks describe the actual work handled by the company instead of generic presentation statements."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[1.75rem] border border-white bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <h3 className="text-xl font-semibold text-slate-900">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[2rem] border border-sky-100 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Why Clients Choose Us
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A business website that now reflects the company more clearly
            </h2>
            <div className="mt-8 space-y-4">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base leading-7 text-slate-700"
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-700 to-cyan-600 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-100">
              Quality Promise
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">
              Durable signage for high-attention environments
            </h3>
            <div className="mt-8 grid gap-4">
              {[
                "Reflective surfaces designed for visibility in low-light and night conditions",
                "Boards and structures produced for long outdoor use and clean installation",
                "Clear warning, regulatory, and directional communication for practical site use",
                "Presentation-ready execution for infrastructure, industry, and project clients",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm leading-7 text-sky-50"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="projects" className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Project Highlights"
            title="Representative work across roads, plants, and construction zones"
            text="These sample project blocks now read like actual business capability statements that help a buyer or operations team understand the company’s scope."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_20px_70px_rgba(15,23,42,0.05)]"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                </div>
                <div className="p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                    {project.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-slate-600">
                    {project.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionTitle
            eyebrow="Execution Process"
            title="A clear workflow from requirement to installation"
            text="This process section explains how work is typically planned and executed for road projects, industrial campuses, and construction zones."
          />

          <div className="grid gap-5">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="flex gap-5 rounded-[1.75rem] border border-sky-100 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-sm font-semibold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section id="contact" className="pb-14 pt-8 sm:pb-20">
        <Container>
          <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-r from-sky-700 via-cyan-600 to-teal-500 p-8 shadow-[0_30px_100px_rgba(14,165,233,0.22)] sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-100">
                  Contact and Business Enquiry
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Contact the team for road safety signs, industrial boards, and project requirements
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-sky-50 sm:text-lg">
                  Reach out for quotations, project discussions, material
                  requirements, or site-specific signage planning. The admin
                  login is also available for the internal dashboard view.
                </p>
              </div>

              <div className="grid gap-4 rounded-[2rem] border border-white/20 bg-white/10 p-6 backdrop-blur">
                {contactOptions.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-semibold text-slate-900 transition hover:bg-sky-50"
                  >
                    <span className="block text-xs uppercase tracking-[0.22em] text-sky-700">
                      {option.label}
                    </span>
                    <span className="mt-1 block">{option.value}</span>
                  </a>
                ))}
                <a
                  href="/admin/login"
                  className="rounded-2xl border border-white/25 bg-white/15 px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Admin Login
                </a>
                <div className="rounded-2xl border border-white/20 px-5 py-4 text-center text-sm font-medium text-white">
                  {company.address}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <Container className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{company.name}</p>
          <p>{company.tagline}</p>
        </Container>
      </footer>
    </main>
  );
}
