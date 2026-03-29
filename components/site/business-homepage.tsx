"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  company,
  contactOptions,
  process,
  services,
  stats,
} from "@/data/site-content";
import {
  websiteProducts,
  websiteWorks,
  type Product,
  type WebWork,
} from "@/data/web-catalog";
import { getStoredProducts, getStoredWorks } from "@/data/web-storage";

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
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.24),transparent_24%),linear-gradient(180deg,#f8fcff_0%,#eef7ff_44%,#ffffff_100%)]" />
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="hero-grid absolute inset-x-0 top-0 h-[44rem] opacity-50" />
    </div>
  );
}

function ProductSpotlight({ featured }: { featured?: Product }) {
  if (!featured) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <div className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white/85 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                Featured Product
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{featured.name}</h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
                {featured.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  {featured.size}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                  {featured.pricing}
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 px-4 py-3 text-sm font-semibold text-slate-900">
              Since {company.since}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="relative h-72 bg-slate-100">
              <img src={featured.image} alt={featured.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 to-transparent" />
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              {featured.features.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="group overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(14,165,233,0.14)]"
    >
      <div className="relative h-56 bg-slate-100">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
      </div>

      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
          {product.category}
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-4 text-base leading-8 text-slate-600">{product.shortDescription}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Size
            </p>
            <p className="mt-2 text-sm text-slate-700">{product.size}</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Starting Price
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{product.pricing}</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Weight
            </p>
            <p className="mt-2 text-sm text-slate-700">{product.weight}</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Material
            </p>
            <p className="mt-2 text-sm text-slate-700">{product.material}</p>
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-6 inline-flex rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200"
        >
          Open Product Page
        </Link>
      </div>
    </motion.article>
  );
}

export function BusinessHomepage() {
  const [products, setProducts] = useState<Product[]>(websiteProducts);
  const [works, setWorks] = useState<WebWork[]>(websiteWorks);

  useEffect(() => {
    setProducts(getStoredProducts());
    setWorks(getStoredWorks());
  }, []);

  const featuredProduct = products[0];

  const homepageStats = useMemo(
    () => [
      ...stats.slice(0, 3),
      { value: `${products.length}`, label: "Product categories currently shown on website" },
    ],
    [products],
  );

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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                {company.name}
              </p>
              <p className="text-xs text-slate-500">{company.tagline}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a href="#products" className="transition hover:text-sky-700">
              Products
            </a>
            <a href="#works" className="transition hover:text-sky-700">
              Real Projects
            </a>
            <a href="#services" className="transition hover:text-sky-700">
              Services
            </a>
            <a href="/admin/login" className="transition hover:text-sky-700">
              Dashboard
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
        <Container className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Product-first catalogue for safety boards and sign systems
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Explore the different safety boards your client can order, not just the company profile.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Browse different types of road, factory, warning, diversion, and
              navigation boards. Every product opens its own page with product
              images, size, weight, material, pricing, and other useful details.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:translate-y-[-1px]"
              >
                Browse Products
              </a>
              <a
                href="#works"
                className="rounded-full border border-sky-200 bg-sky-50 px-6 py-3.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                See Real Projects
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "Each product opens a separate detail page",
                "Cards show size, weight, and starting price quickly",
                "Dashboard can add or remove products and web works",
                "UI stays clean and simple for business visitors",
              ].map((item) => (
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

          <ProductSpotlight featured={featuredProduct} />
        </Container>
      </section>

      <section className="relative mt-14 sm:mt-20">
        <Container>
          <div className="grid gap-5 rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.06)] sm:grid-cols-2 xl:grid-cols-4">
            {homepageStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-6"
              >
                <p className="text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section id="products" className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Product Catalogue"
            title="Different safety boards and sign systems shown clearly on the website"
            text="Instead of staying general, the homepage now introduces the actual products clients care about. Visitors can open each product and view matching project examples."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <section id="works" className="border-y border-sky-100 bg-gradient-to-b from-sky-50/80 to-white py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Real Projects"
            title="Current and recent works that support the products on the website"
            text="This section gives buyers a quick look at the type of jobs being executed, while every product detail page shows the projects related to that category."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {works.map((work, index) => {
              const linkedProduct = products.find((item) => item.slug === work.productSlug);

              return (
                <motion.article
                  key={work.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  className="rounded-[2rem] border border-white bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                      {linkedProduct?.category ?? "Website Work"}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      {work.status}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-900">{work.title}</h3>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {work.client} - {work.location}
                  </p>
                  <p className="mt-4 text-base leading-8 text-slate-600">{work.summary}</p>
                  {linkedProduct ? (
                    <Link
                      href={`/products/${linkedProduct.slug}`}
                      className="mt-6 inline-flex text-sm font-semibold text-sky-700"
                    >
                      View {linkedProduct.name}
                    </Link>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="services" className="py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionTitle
            eyebrow="Execution Support"
            title="Design, fabrication, installation, and rollout support around the products"
            text="The product catalogue leads the site now, while these service blocks explain how the team helps from planning to installation."
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
                  <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionTitle
            eyebrow="Execution Process"
            title="A simple workflow from requirement to installed board"
            text="The UI stays straightforward and business-friendly, while the site still explains how enquiries move into fabrication and installation."
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
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-base leading-8 text-slate-600">{item.description}</p>
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
                  Contact and Product Enquiry
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Ask about any product category, board requirement, or project execution need
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-sky-50 sm:text-lg">
                  Use the website to browse products, open product pages, and
                  review real projects. The dashboard is available for the team
                  to add or remove products and works shown online.
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
