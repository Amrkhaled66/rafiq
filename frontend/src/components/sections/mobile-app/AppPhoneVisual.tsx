import Image from "next/image";
import phones from "@/src/assets/app.webp";
import squiggle from "@/src/assets/app-float1.webp";
import accents from "@/src/assets/app-float2.webp";

export default function AppPhoneVisual() {
  return (
    <div className="relative isolate mb-[-4%] aspect-[1/1.13] w-[106%] max-w-[465px] translate-y-0 justify-self-center opacity-100 motion-safe:transition-[opacity,translate] motion-safe:duration-650 motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-safe:starting:translate-y-4 motion-safe:starting:opacity-0 md:mb-0 md:w-full md:max-w-[565px] [@media(min-width:1100px)_and_(max-height:820px)]:max-w-[min(520px,calc((100svh_-_170px)/1.14))]">
      <div className="absolute top-[14%] left-[-4%] -z-10 aspect-square w-[108%] rounded-[50%_48%_47%_49%] bg-[#fbeaea] md:top-[13%] md:left-[-3%] md:w-[104%]" aria-hidden="true" />
      <Image
        src={phones}
        alt="تطبيق رفيق: شاشة مهامي في المقدمة وجلسة التركيز لواجب الفيزياء خلفها"
        className="relative mx-auto h-auto w-[96%] md:w-[92%]"
        sizes="(max-width: 767px) 88vw, (max-width: 1100px) 46vw, 510px"
        preload
      />
      <div className="pointer-events-none" aria-hidden="true">
        <Image src={squiggle} alt="" className="absolute top-[42%] left-[-19%] hidden h-auto w-[100px] -rotate-12 md:block min-[68.8125rem]:left-[-17%] min-[68.8125rem]:w-[120px]" sizes="120px" />
        <Image src={accents} alt="" className="absolute top-[-11%] right-[-8%] h-auto w-[85px] rotate-[7deg] md:top-[-8%] md:right-[-13%] md:w-[110px] min-[68.8125rem]:right-[-10%] min-[68.8125rem]:w-[140px]" sizes="140px" />
        <span className="absolute top-[7%] left-[18%] hidden size-2.5 rounded-full bg-[#f9dfe1] md:block" />
        <span className="absolute right-[-4%] bottom-[12%] hidden size-[7px] rounded-full bg-[#f9dfe1] md:block" />
      </div>
    </div>
  );
}
