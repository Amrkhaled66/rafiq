import { Icon } from "@iconify/react";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useStudentProfileSearch from "@/features/admin/student-profile/hooks/useStudentProfileSearch";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";

export default function StudentProfileSearchPage() {
  const {
    phone,
    error,
    isPending,
    canSubmit,
    handleSubmit,
    handlePhoneChange,
  } = useStudentProfileSearch();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full">
        <PageHeader
          icon="solar:user-circle-linear"
          title="ملف متابعة الطالب"
          subtitle="ابحث عن الطالب للوصول إلى ملفه الأكاديمي ومتابعة الأداء."
        />

        <section className="mt-8 rounded-xl bg-white p-6 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="bg-brand-primary/5 text-brand-primary mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl">
              <Icon icon="ph:student" className="size-10" />
            </div>

            <h2 className="text-foreground text-2xl font-black">
              البحث عن طالب
            </h2>

            <p className="text-subTitle mt-2 text-sm">
              أدخل رقم الهاتف للوصول إلى بيانات الطالب
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-sm space-y-5"
            noValidate
          >
            <div>
              <FormInput
                label="رقم هاتف الطالب"
                name="student-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0101234567"
                value={phone}
                error={error ?? undefined}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              disabled={!canSubmit}
              className="h-12 w-full rounded-xl text-base font-bold"
            >
              {isPending ? "جاري البحث..." : "بحث عن الطالب"}
            </Button>

            {isPending && (
              <p className="text-subTitle text-center text-xs">
                يتم التحقق من بيانات الطالب...
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
