import {
  websiteProducts,
  websiteWorks,
  type Product,
  type WebWork,
} from "@/data/web-catalog";

export const WEBSITE_PRODUCTS_KEY = "safepath-website-products";
export const WEBSITE_WORKS_KEY = "safepath-website-works";

function readList<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeList<T>(key: string, value: T[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredProducts() {
  return readList<Product>(WEBSITE_PRODUCTS_KEY, websiteProducts);
}

export function saveStoredProducts(products: Product[]) {
  writeList(WEBSITE_PRODUCTS_KEY, products);
}

export function getStoredWorks() {
  return readList<WebWork>(WEBSITE_WORKS_KEY, websiteWorks);
}

export function saveStoredWorks(works: WebWork[]) {
  writeList(WEBSITE_WORKS_KEY, works);
}
