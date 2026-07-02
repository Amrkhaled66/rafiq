"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as fbq from "@/src/lib/fpixel";

export default function MetaPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fbq.pageview();
  }, [pathname, searchParams]);

  return null;
}