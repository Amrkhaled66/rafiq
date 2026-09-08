import Image from "next/image";
import { appDownloadLinks } from "@/src/data/app-download";

const storeLinkClassName =
  "relative flex aspect-[3/1] h-auto w-[min(42vw,175px)] shrink-0 items-center justify-center rounded-[11px] border-0 bg-transparent transition-transform duration-180 ease-in-out hover:enabled:-translate-y-0.5 [&:is(a):hover]:-translate-y-0.5 focus-visible:outline-[3px] focus-visible:outline-offset-6 focus-visible:outline-brand-primary disabled:cursor-not-allowed motion-reduce:transition-none md:aspect-auto md:h-[52px] md:w-[155px] min-[68.8125rem]:h-[70px] min-[68.8125rem]:w-[210px]";

const stores = [
  {
    name: "App Store",
    href: appDownloadLinks.appStore,
    image: "/store-badges/app-store.svg",
    width: 120,
    height: 40,
    className: "h-auto w-full",
  },
  {
    name: "Google Play",
    href: appDownloadLinks.googlePlay,
    image: "/store-badges/google-play.png",
    width: 646,
    height: 250,
    // The official Google artwork includes its own transparent clear space.
    className: "absolute h-auto w-[119%] max-w-none",
  },
];

const apkLinkClassName =
  "mt-4 flex items-center justify-center gap-2 self-center rounded-[11px] bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-transform duration-180 ease-in-out hover:enabled:-translate-y-0.5 [&:is(a):hover]:-translate-y-0.5 focus-visible:outline-[3px] focus-visible:outline-offset-6 focus-visible:outline-brand-primary disabled:cursor-not-allowed motion-reduce:transition-none md:mt-6 md:self-start md:px-[18px] md:py-3.5";

export default function StoreDownloadLinks() {
  const availability =
    appDownloadLinks.appStore && appDownloadLinks.googlePlay
      ? "متاح الآن على أندرويد و iOS"
      : appDownloadLinks.googlePlay
        ? "متاح الآن على أندرويد · قريبًا على iOS"
        : appDownloadLinks.appStore
          ? "متاح الآن على iOS · قريبًا على أندرويد"
          : "قريبًا على أندرويد و iOS";

  return (
    <div className="mt-6.25 md:mt-8">
      <div
        className="flex items-center justify-center gap-3 md:justify-start min-[68.8125rem]:gap-4.5"
        aria-label="تحميل تطبيق رفيق"
      >
        {stores.map((store) => {
          const artwork = (
            <Image
              src={store.image}
              width={store.width}
              height={store.height}
              alt={`Download on ${store.name}`}
              className={`${store.className} ${!store.href && "opacity-50"}`} //
              unoptimized
            />
          );

          return store.href ? (
            <a
              key={store.name}
              href={store.href}
              className={storeLinkClassName}
              aria-label={`حمّل تطبيق رفيق من ${store.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {artwork}
            </a>
          ) : (
            <button
              key={store.name}
              type="button"
              className={storeLinkClassName}
              disabled
              aria-label={`تطبيق رفيق على ${store.name} — قريبًا`}
              title="رابط التحميل هيتوفر قريبًا"
            >
              {artwork}
            </button>
          );
        })}
      </div>
      {/* <a
        href={appDownloadLinks.apk}
        className={apkLinkClassName}
        aria-label="تحميل تطبيق رفيق APK مباشرة"
        download
        rel="noopener noreferrer"
      >
        تحميل التطبيق APK
      </a> */}
      <p className="mt-[17px] text-xs leading-[1.7] text-[#777781] md:mt-[19px] md:text-[13px]">
        {availability}
      </p>
    </div>
  );
}
