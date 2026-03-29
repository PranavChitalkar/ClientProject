"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { company, contactOptions } from "@/data/site-content";
import { websiteProducts, websiteWorks, type Product } from "@/data/web-catalog";
import { getStoredProducts, getStoredWorks } from "@/data/web-storage";

export function ProductDetailPage({ slug }: { slug: string }) {
  const [products, setProducts] = useState(websiteProducts);
  const [works, setWorks] = useState(websiteWorks);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const storedProducts = getStoredProducts();
    const storedWorks = getStoredWorks();
    setProducts(storedProducts);
    setWorks(storedWorks);
  }, []);

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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] text-slate-900">
      <section className="border-b border-sky-100 bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
                Product Detail
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Back to Website
              </Link>
              <a
                href={`https://wa.me/${company.whatsapp.replace(/\D/g, "")}`}
                className="rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200"
              >
                Ask for Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-14">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="relative h-[26rem] bg-slate-100">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {product.category}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {product.gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-[1.5rem] border bg-white p-2 shadow-sm transition ${
                  selectedImage === image ? "border-sky-300" : "border-slate-100"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="h-28 w-full rounded-[1rem] object-cover"
                />
              </button>
            ))}
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
            <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-700 to-cyan-600 p-7 text-white shadow-[0_20px_80px_rgba(14,165,233,0.18)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">
                Contact Team
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Get quote, quantity, and size details</h2>
              <div className="mt-6 grid gap-3">
                {contactOptions.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-900"
                  >
                    {option.label}: {option.value}
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
