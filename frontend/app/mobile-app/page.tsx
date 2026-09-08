import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import DownloadHero from "@/src/components/sections/mobile-app/DownloadHero";

export const metadata: Metadata = {
  title: "حمّل تطبيق رفيق | رفيق معاك في كل خطوة",
  description:
    "نزّل تطبيق رفيق وتابع خطتك، مهامك، جلسات التركيز ومتابعة الكوتش من أي مكان.",
  alternates: { canonical: "/mobile-app" },
};

export default function MobileAppPage() {
  return (
    <>
      <Navbar variant="download" />
      <main>
        <DownloadHero />
      </main>
    </>
  );
}
