import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Cairo } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";

import MetaPixelEvents from "@/src/components/shared/MetaPixelEvents";
import Footer from "@/src/components/layout/Footer";

const pixelId = 941134205710592;

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rafiq-edu.com"),

  title: "رفيق | متابعة وتنظيم الثانوية العامة",

  description:
    "رفيق يساعد طلاب الثانوية العامة على تنظيم المذاكرة، متابعة المهام، الالتزام بالخطة، وتحقيق تقدم مستمر خلال السنة.",

  keywords: [
    "رفيق",
    "Rafiq",
    "الثانوية العامة",
    "طلاب الثانوية العامة",
    "تنظيم المذاكرة",
    "متابعة المذاكرة",
    "خطة مذاكرة",
    "التعليم اونلاين",
    "متابعة الطلاب",
  ],

  authors: [
    {
      name: "Rafiq",
    },
  ],

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "رفيق | متابعة وتنظيم الثانوية العامة",

    description:
      "نساعدك تنظم مذاكرتك، تتابع مهامك وتلتزم بخطتك طوال رحلة الثانوية العامة.",

    url: "https://rafiq-edu.com",

    siteName: "Rafiq",

    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "رفيق - متابعة وتنظيم طلاب الثانوية العامة",
      },
    ],

    locale: "ar_EG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "رفيق | متابعة وتنظيم الثانوية العامة",

    description:
      "نساعدك تنظم مذاكرتك، تتابع مهامك وتلتزم بخطتك طوال رحلة الثانوية العامة.",

    images: ["/og-image.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-white text-black">
        {children}

        <Footer />

        {pixelId && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(
                  window,
                  document,
                  'script',
                  'https://connect.facebook.net/en_US/fbevents.js'
                );

                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `}
            </Script>

            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>

            <Suspense fallback={null}>
              <MetaPixelEvents />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}