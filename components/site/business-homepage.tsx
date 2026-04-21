"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState, useEffect } from "react";
import {
  company,
  contactOptions,
  process,
  services,
  stats,
} from "@/data/site-content";
import type { Product, WebWork } from "@/data/web-catalog";
import type { WebsiteCatalogSnapshot } from "@/lib/dashboard-data";

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
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{text}</p>
    </div>
  );
}

function FloatingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_24%),linear-gradient(180deg,#fffaf5_0%,#fffefc_44%,#ffffff_100%)]" />
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />
      <div className="hero-grid absolute inset-x-0 top-0 h-[44rem] opacity-40" />
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
    >
      <div className="relative flex h-60 items-center justify-center bg-slate-50 p-8">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            <svg className="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wider">Image to be added</span>
          </div>
        )}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-7">
        <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">
          {product.name}
        </h3>
        <p className="line-clamp-2 mt-3 text-sm leading-relaxed text-slate-500">
          {product.shortDescription}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Starting Price</span>
            <span className="text-sm font-bold text-slate-900">{product.pricing}</span>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-orange-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

type BusinessHomepageProps = {
  initialCatalog?: WebsiteCatalogSnapshot;
};

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export function BusinessHomepage({ initialCatalog }: BusinessHomepageProps) {
  const products: Product[] = initialCatalog?.products ?? [];
  const works: WebWork[] = initialCatalog?.websiteWorks ?? [];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const homepageStats = useMemo(
    () => [
      ...stats.slice(0, 3),
      { value: `${products.length}`, label: "Product categories currently shown on website" },
    ],
    [products],
  );

  const navLinks = [
    { href: "#products", label: "Products" },
    { href: "#works", label: "Portfolio" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <main className="relative overflow-hidden bg-white text-slate-900">
      <FloatingBackground />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 w-full ${
          isScrolled
            ? "bg-white lg:bg-white/30 border-b border-slate-100 lg:border-b-0 lg:backdrop-blur-lg"
            : "border-b border-sky-100/80 bg-white/80 backdrop-blur-xl"
        }`}
      >
        <Container className="flex min-h-20 items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-xs font-black text-white shadow-lg shadow-red-200/50">
              ME
            </div>
            <div className="hidden sm:block">
              <p className="text-base leading-none font-black uppercase tracking-tight text-slate-900">
                MATOSHREE
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Engineering</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-[12px] font-bold uppercase tracking-widest text-slate-600 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="transition hover:text-orange-600 hover:scale-105"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
              className="rounded-full bg-orange-600 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-200/50 transition hover:bg-orange-700"
            >
              Quote
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-900 transition hover:bg-orange-600 hover:text-white lg:hidden flex-shrink-0"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </Container>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-80 bg-white shadow-2xl flex flex-col lg:hidden overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-900 transition hover:bg-orange-600 hover:text-white"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-3 p-6 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  scrollToSection(e, link.href);
                  setIsMobileMenuOpen(false);
                }}
                className="block px-6 py-5 text-base font-bold uppercase tracking-wider text-slate-700 transition hover:text-orange-600 hover:bg-orange-50 rounded-xl bg-slate-50 border-l-4 border-l-transparent hover:border-l-orange-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="border-t border-slate-100 p-6 pt-4">
            <a
              href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
              className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 text-center text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-orange-300/50 transition hover:shadow-2xl hover:from-orange-700 hover:to-red-700 w-full"
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}

      <div className="h-16" />

      <section id="top" className="relative pb-20 pt-12 sm:pt-20 lg:pt-28">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-red-50 px-5 py-2 text-[12px] font-bold uppercase tracking-widest text-red-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
              India's Safety Board Experts
            </div>

            <h1 className="mt-8 text-5xl font-black leading-[0.9] tracking-tighter text-slate-950 sm:text-6xl lg:text-7xl">
              FABRICATION & <span className="text-orange-600">RETROREFLECTIVE BOARDS</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-slate-700">
              MATOSHREE ENGINEERING manufactures and installs all types of fabrication works and high-visibility retroreflective sign boards for national highways, industrial plants, warehouses, and construction zones across India.
            </p>

            <ul className="mt-8 max-w-lg space-y-4">
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                Compliant with IRC & MORTH standards
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                Expert site survey and positioning
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                Professional installation & support
              </li>
            </ul>

            <div className="mt-12 flex flex-wrap gap-5">
              <a
                href="#products"
                className="rounded-full bg-orange-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-orange-300/50 transition hover:-translate-y-1 hover:bg-orange-700"
              >
                View Products
              </a>
              <a
                href="#contact"
                className="rounded-full bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-red-200/50 transition hover:-translate-y-1 hover:bg-red-700"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[3rem] bg-gradient-to-b from-slate-100 to-slate-50 shadow-2xl">
              <img src="/images/hero-bg.png" alt="MATOSHREE ENGINEERING Retroreflective Boards" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-3xl font-black italic leading-tight">Safety First,</p>
                <p className="text-2xl font-black italic leading-tight">Business Growth</p>
              </div>
            </div>

            <div className="glass-card absolute -bottom-6 -left-6 max-w-[240px] rounded-3xl p-8 shadow-xl">
              <div className="text-4xl font-black text-orange-600">13+</div>
              <p className="mt-2 text-xs font-bold uppercase leading-relaxed tracking-widest text-slate-600">Years of Industry Excellence</p>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="relative z-10 -mt-10">
        <Container>
          <div className="grid gap-6 rounded-3xl bg-slate-900 p-8 shadow-2xl sm:grid-cols-2 xl:grid-cols-4">
            {homepageStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="border-r border-slate-800 px-6 last:border-0"
              >
                <p className="text-5xl font-black tracking-tight text-white">{item.value}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section id="products" className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Product Catalogue"
            title="Safety Signboard Solutions for Every Need"
            text="From highway traffic boards to industrial safety signage and construction zone warnings, explore MATOSHREE ENGINEERING's current product range managed from the dashboard and served through the website catalog."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <section id="works" className="border-y border-slate-100 bg-slate-50/50 py-24 sm:py-32">
        <Container>
          <SectionTitle
            eyebrow="Portfolio of Excellence"
            title="Real-World Safety Signboard Projects"
            text="MATOSHREE ENGINEERING has successfully executed fabrication and signage projects across major highways, industrial complexes, and construction sites. Each project demonstrates our commitment to quality, safety, and on-time delivery."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {works.map((work, index) => {
              const linkedProduct = products.find((item) => item.slug === work.productSlug);

              return (
                <motion.article
                  key={work.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  className="group rounded-3xl border border-white bg-white p-2 shadow-sm transition hover:shadow-xl"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                    <img src={work.image || "/images/hero-bg.png"} alt={work.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {work.location}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-orange-600">{work.title}</h3>
                    <p className="mt-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                      {work.client}
                    </p>
                    <p className="line-clamp-2 mt-4 text-sm leading-relaxed text-slate-600">{work.summary}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {work.status}
                      </span>
                      {linkedProduct ? (
                        <Link
                          href={`/products/${linkedProduct.slug}`}
                          className="text-[11px] font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700"
                        >
                          View Board Details {"->"}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="services" className="py-24 sm:py-32">
        <Container className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionTitle
            eyebrow="Our Services"
            title="End-to-End Signage Solutions"
            text="From concept to installation, MATOSHREE ENGINEERING manages every aspect of your fabrication and signage project. Our comprehensive services ensure visibility, compliance, and long-term durability."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">{service.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="hero-grid absolute inset-0 opacity-10" />
        <Container className="relative z-10 grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-500">
              Our Process
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              CONSULTATION TO <span className="text-orange-500">INSTALLATION</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
            text="MATOSHREE ENGINEERING follows a proven four-step process to deliver fabrication and signage solutions that meet your exact requirements and safety standards."
            </p>
          </div>

          <div className="grid gap-4">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-lg font-black text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section id="contact" className="py-24 sm:py-32">
        <Container>
          <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 lg:p-20">
            <div className="orange-gradient absolute right-0 top-0 h-full w-1/2 translate-x-1/4 skew-x-12 opacity-10" />

            <div className="relative z-10 grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-500">
                  Get in Touch
                </p>
                <h2 className="mt-6 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Ready to enhance <span className="text-orange-500">safety?</span>
                </h2>
                <p className="mt-8 max-w-xl text-lg font-medium text-slate-400">
                  Contact MATOSHREE ENGINEERING today for a free consultation, site survey, or custom quote."
                  Our team is ready to support your signage project from start to finish.
                </p>

                <div className="mt-12 flex flex-wrap gap-8">
                  <div className="flex flex-col">
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Availability</span>
                    <span className="font-bold text-white">Pan-India Services</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Compliance</span>
                    <span className="font-bold text-white">IRC & MORTH Standard</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {contactOptions.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-orange-600"
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 transition-colors group-hover:text-white">
                        {option.label}
                      </span>
                      <span className="mt-1 text-lg font-bold uppercase text-white">{option.value}</span>
                    </div>
                    <svg className="h-5 w-5 transform text-white transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-slate-100 bg-white py-12">
        <Container className="flex flex-col gap-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-orange-600" />
            <p className="font-bold uppercase tracking-tight text-slate-900">{company.name} © {new Date().getFullYear()}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-[11px] font-medium uppercase tracking-widest">{company.tagline}</p>
            <Link href="/admin/login" className="text-xs font-semibold uppercase tracking-widest text-slate-500 transition hover:text-orange-600">Admin</Link>
          </div>
        </Container>
      </footer>
    </main>
  );
}
