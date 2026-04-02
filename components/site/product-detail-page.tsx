"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { company, contactOptions } from "@/data/site-content";
import type { Product, WebWork } from "@/data/web-catalog";
import type { WebsiteCatalogSnapshot } from "@/lib/dashboard-data";

type ProductDetailPageProps = {
  slug: string;
  initialCatalog?: WebsiteCatalogSnapshot;
};

export function ProductDetailPage({ slug, initialCatalog }: ProductDetailPageProps) {
  const products: Product[] = initialCatalog?.products ?? [];
  const works: WebWork[] = initialCatalog?.websiteWorks ?? [];
  const [selectedImage, setSelectedImage] = useState("");

  const product = useMemo(() => products.find((item) => item.slug === slug), [products, slug]);
  const relatedWorks = useMemo(() => works.filter((item) => item.productSlug === slug), [works, slug]);
  const relatedProducts = useMemo(() => products.filter((item) => item.slug !== slug).slice(0, 3), [products, slug]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.gallery[0] ?? product.image);
    }
  }, [product]);

  if (!product) {
    return <MissingProduct products={products} />;
  }

  const specCards = [
    { label: "Standard Size", value: product.size },
    { label: "Approx Weight", value: product.weight },
    { label: "Material", value: product.material },
    { label: "Thickness", value: product.thickness },
    { label: "Visibility", value: product.visibility },
    { label: "Support", value: product.warranty },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-orange-600">
                Product Specifications
              </p>
              <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-slate-950 sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-3xl text-lg font-medium leading-relaxed text-slate-500">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-slate-900 transition hover:bg-slate-50"
              >
                Back to Home
              </Link>
              <a
                href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
                className="rounded-full bg-orange-600 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white shadow-xl shadow-orange-200 transition hover:bg-orange-700"
              >
                Inquiry for Order
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-14">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
            <div className="relative flex h-[30rem] items-center justify-center bg-slate-50 p-12">
              {selectedImage || product.image ? (
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                  <svg className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-bold uppercase tracking-widest">Image to be added by user</span>
                </div>
              )}
              <div className="absolute left-6 top-6 rounded-full bg-orange-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                {product.category}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {product.gallery.length > 0 ? product.gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-2xl border bg-white p-2 shadow-sm transition ${
                  selectedImage === image ? "scale-105 border-orange-600" : "border-slate-100 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="h-28 w-full rounded-xl object-cover"
                />
              </button>
            )) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex h-28 items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/30">
                  <span className="text-[10px] font-bold uppercase text-slate-300">View {i}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                  Product Summary
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                  Product information buyers usually ask first
                </h2>
              </div>
              <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-300 to-yellow-200 px-5 py-4 text-right text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Starting Price</p>
                <p className="mt-2 text-xl font-semibold">{product.pricing}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {specCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              Applications
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {product.bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              Features
            </p>
            <div className="mt-4 space-y-3">
              {product.features.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Product Use In Real Projects
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Reference jobs for this product
            </h2>
            <div className="mt-6 space-y-4">
              {product.realProjects.map((item) => (
                <div
                  key={`${item.title}-${item.client}`}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm font-medium text-sky-700">
                    {item.client} - {item.location}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-900 p-8 shadow-2xl">
              <div className="orange-gradient absolute right-0 top-0 h-24 w-24 rounded-bl-[100px] opacity-10 transition group-hover:scale-150" />
              <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                Direct Order
              </p>
              <h2 className="relative z-10 mt-4 text-3xl font-black uppercase leading-none text-white italic">Get quote & size details</h2>
              <div className="relative z-10 mt-8 grid gap-4">
                {contactOptions.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-orange-600"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white">{option.label}</span>
                      <span className="font-bold tracking-tight text-white">{option.value}</span>
                    </div>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                More Products
              </p>
              <div className="mt-6 grid gap-4">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.pricing}</p>
                  </Link>
                ))}
              </div>
            </div>

            {relatedWorks.length > 0 ? (
              <div className="rounded-[2rem] border border-sky-100 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Current Website Works
                </p>
                <div className="mt-5 space-y-3">
                  {relatedWorks.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-4"
                    >
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.client} - {item.location}</p>
                      <p className="mt-2 text-sm text-slate-600">{item.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function MissingProduct({ products }: { products: Product[] }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-16">
      <div className="w-full max-w-2xl rounded-[2rem] border border-sky-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          Product Not Found
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          This product page is not available right now
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          The item may have been removed from the dashboard. You can return to the website and open one of the currently active products.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
          {products.slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              href={`/products/${item.slug}`}
              className="rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
