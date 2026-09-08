import Image from "next/image";
import StoreDownloadLinks from "./StoreDownloadLinks";

export default function AppDownloadCopy() {
  return (
    <div className="relative z-[1] text-center md:pb-4 md:text-right">
      <span className="inline-flex items-center gap-[7px] rounded-full border border-[#f7dfe0] bg-[#fff2f2] px-3 pt-[7px] pb-2 text-xs leading-normal font-medium text-brand-primary md:gap-[9px] md:px-[15px] md:pt-[9px] md:pb-2.5 md:text-sm">
        <Image src="/store-badges/smartphone.svg" width={20} height={20} alt="" className="size-[17px] md:size-5" />
        رفيق الآن على موبايلك
      </span>

      <h1
        id="app-download-title"
        className="mt-[23px] text-[clamp(44px,11.5vw,62px)] leading-[1.23] font-bold text-[#19191c] md:mt-[26px] md:text-[clamp(46px,5.5vw,60px)] md:leading-[1.22] min-[68.8125rem]:text-[clamp(56px,5.3vw,76px)]"
      >
        <span className="block">رفيق معاك...</span>
        <span className="mt-[3px] block text-brand-primary md:mt-1.5">في كل خطوة.</span>
      </h1>

      <p className="mx-auto mt-[22px] max-w-[350px] text-[17px] leading-[1.85] font-normal text-pretty text-[#66666e] md:mx-0 md:mt-[26px] md:max-w-[470px] md:text-lg md:leading-[1.8] min-[68.8125rem]:text-[clamp(18px,1.55vw,22px)]">
        نزّل تطبيق رفيق وتابع خطتك، مهامك، جلسات التركيز ومتابعة الكوتش من أي مكان.
      </p>

      <StoreDownloadLinks />
    </div>
  );
}
