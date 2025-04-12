"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/data/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const isAuthenticated = checkAuth();
    const isAuthPage =
      pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

    if (!isAuthenticated && !isAuthPage) {
      router.push("/sign-in");
    }
  }, [checkAuth, pathname, router]);

  return <>{children}</>;
}
