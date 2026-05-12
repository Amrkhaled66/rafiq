import React from "react";
import logo from "@/assets/logo1.svg";
import adminAvatar from "@/assets/admin-avatr.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background font-main relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* BACKGROUND GRADIENTS */}
      <div className="bg-brand-primary-soft pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-brand-primary-muted pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full blur-3xl" />
      <div className="bg-brand-primary-soft/60 pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      {/* DECORATION DOTS */}
      <div className="bg-brand-primary/40 pointer-events-none absolute top-24 right-10 hidden h-2 w-2 rounded-full lg:block" />
      <div className="bg-brand-primary/30 pointer-events-none absolute bottom-28 left-16 hidden h-3 w-3 rounded-full lg:block" />
      <div className="bg-brand-primary-soft pointer-events-none absolute top-20 left-[45%] hidden h-4 w-4 rounded-full lg:block" />

      <div className="z-10 container grid min-h-screen w-full grid-cols-1 items-center px-5 py-8 lg:grid-cols-2 lg:px-10">
        <div className="flex w-full items-center justify-center">
          <div className="border-brand-primary-soft shadow-brand-primary-soft/60 w-full max-w-130 rounded-4xl border bg-white/90 px-6 py-10 shadow-2xl backdrop-blur-xl sm:px-10 lg:py-12">
            <div className="mb-8 flex flex-col items-center text-center">
              <img src={logo} alt="رفيق" className="h-20 object-contain" />
              <p className="text-subTitle mt-3 text-base font-medium">
                أدخل بياناتك للوصول إلى لوحة التحكم
              </p>
            </div>

            <div className="w-full">{children}</div>
          </div>
        </div>

        <div className="hidden h-full items-center justify-center text-center lg:flex">
          <div className="relative z-10 w-full max-w-sm text-start">
            <h1 className="font-cairo text-foreground text-5xl leading-tight font-black">
             مرحبا ايها
              <span className="text-brand-primary"> الكوتش</span>
            </h1>

            <p className="text-subTitle mt-5 max-w-xs text-lg leading-9">
              من هنا يمكنك إدارة الطلاب، المحتوى، الاشتراكات، ومتابعة أداء
              المنصة من مكان واحد بكل سهولة.
            </p>
          </div>

          <div className="absolute bottom-0 left-14 mt-8">
            <div className="bg-brand-primary-soft/70 absolute bottom-0 h-40 w-96 rounded-full blur-3xl" />

            <img
              src={adminAvatar}
              alt="مسؤول رفيق"
              className="relative z-10 w-full max-w-[430px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
