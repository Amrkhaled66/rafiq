import AppDownloadCopy from "./AppDownloadCopy";
import AppPhoneVisual from "./AppPhoneVisual";

export default function DownloadHero() {
  return (
    <section
      className="flex min-h-svh items-start overflow-clip bg-white px-6 pt-[137px] pb-0 md:items-center md:px-8 md:pt-[156px] md:pb-12 min-[68.8125rem]:px-10 [@media(min-width:1100px)_and_(max-height:820px)]:pt-[140px] [@media(min-width:1100px)_and_(max-height:820px)]:pb-7"
      aria-labelledby="app-download-title"
      dir="rtl"
    >
      <div className="mx-auto grid w-full max-w-[520px] grid-cols-1 items-center gap-[46px] md:max-w-[1224px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.06fr)] md:gap-8 min-[68.8125rem]:gap-[clamp(40px,5vw,80px)]">
        <AppDownloadCopy />
        <AppPhoneVisual />
      </div>
    </section>
  );
}
