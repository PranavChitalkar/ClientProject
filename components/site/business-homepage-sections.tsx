"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { company, contactOptions } from "@/data/site-content";
import type { Product, WebWork } from "@/data/web-catalog";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-600">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{text}</p>
    </div>
  );
}

export function FloatingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_24%),linear-gradient(180deg,#fffaf5_0%,#fffefc_44%,#ffffff_100%)]" />
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl" />
      <div className="hero-grid absolute inset-x-0 top-0 h-[44rem] opacity-40" />
    </div>
  );
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
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
          <span className="rounded-full bg-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">{product.category}</span>
        </div>
      </div>

      <div className="p-7">
        <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">{product.name}</h3>
        <p className="line-clamp-2 mt-3 text-sm leading-relaxed text-slate-500">{product.shortDescription}</p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Starting Price</span>
            <span className="text-sm font-bold text-slate-900">{product.pricing}</span>
          </div>
          <Link href={`/products/${product.slug}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-orange-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function SiteFooter() {
  return (
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
  );
}

export function ContactCards() {
  return (
    <div className="flex flex-col gap-4">
      {contactOptions.map((option) => (
        <a key={option.label} href={option.href} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-orange-600">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500 transition-colors group-hover:text-white">{option.label}</span>
            <span className="mt-1 text-lg font-bold uppercase text-white">{option.value}</span>
          </div>
          <svg className="h-5 w-5 transform text-white transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
          </svg>
        </a>
      ))}
    </div>
  );
}

export function PortfolioCard({ work, index, linkedProductName, linkedProductSlug }: { work: WebWork; index: number; linkedProductName?: string; linkedProductSlug?: string }) {
  return (
    <motion.article
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{work.location}</span>
        </div>
        <h3 className="mt-3 text-xl font-bold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-orange-600">{work.title}</h3>
        <p className="mt-3 text-sm font-bold uppercase tracking-wider text-slate-500">{work.client}</p>
        <p className="line-clamp-2 mt-4 text-sm leading-relaxed text-slate-600">{work.summary}</p>
        <div className="mt-6 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{work.status}</span>
          {linkedProductSlug ? (
            <Link href={`/products/${linkedProductSlug}`} className="text-[11px] font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700">
              View {linkedProductName ?? "Board"} Details {"->"}
            </Link>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
