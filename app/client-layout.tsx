"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}

