import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const currencyType = {
  usd: "$",
  vnd: "₫",
  gbp: "£",
  eur: "€",
  cad: "$",
  jpy: "¥",
  aud: "$",
  chf: "CHF",
  cny: "¥",
  hkd: "$",
  nok: "kr",
  sek: "kr",
  sgd: "$",
  zar: "R",
  twd: "NT$",
  thb: "฿",
  php: "₱",
  idr: "Rp",
  myr: "RM",
  krw: "₩",
  vef: "Bs",
  clp: "$",
  pkr: "₨",
  bdt: "৳",
  uah: "₴",
  cop: "$",
  mxn: "$",
  brl: "R$",
  ars: "$",
  pen: "S/",
  clf: "UF",
  isk: "kr",
  huf: "Ft",
  czk: "Kč",
  inr: "₹",
};
// formatPostTime;
export const formatPostTime = (dateString: string): string => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return diffInSeconds <= 1 ? "just now" : `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  // If it's older than 24 hours, show time in Swedish format
  return date.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const sanitize = <T>(data: T | undefined, type = "object"): T => {
  switch (type) {
    case "string":
      return typeof data === "string" ? data : ("" as T);
    case "array":
      return Array.isArray(data) ? data : ([] as T);
    case "object":
      return typeof data === "object" && !Array.isArray(data) && data !== null
        ? data
        : ({} as T);
    default:
      return data as T;
  }
};
