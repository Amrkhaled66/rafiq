import Model from "./Model";
import {
  useNewLeadForm,
  type NewLeadFormData,
} from "../../hooks/useNewLeadForm";

type NewLeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: NewLeadFormData) => Promise<void> | void;
};

const NewLeadModal = ({ isOpen, onClose, onSubmit }: NewLeadModalProps) => {
  const {
    values,
    errors,
    isSubmitting,
    isDone,
    submitError,
    handleNameChange,
    handlePhoneChange,
    handleSubmit,
  } = useNewLeadForm({ isOpen, onSubmit });

  return (
    <Model isOpen={isOpen} onClose={onClose}>
      <div dir="rtl" className="relative mx-auto w-full max-w-[480px]">
        <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f5] text-xl text-[#777] transition hover:bg-[#eeeeee] hover:text-brand-primary"
          >
            ×
          </button>

          {!isDone ? (
            <>
              <div className="mb-7 text-center">
                <h2 className="mx-auto max-w-90 text-[24px] font-black leading-[1.45] text-[#1f1f1f] sm:text-[28px]">
                  سجّل بياناتك وحد من التيم
                  <br />
                  <span className="text-brand-primary">هيتواصل معاك</span>
                </h2>

                <p className="mx-auto mt-3 max-w-85 text-sm leading-6 text-[#777]">
                  سيب اسمك ورقمك وهنكلمك في أقرب وقت.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#202020]">
                    الاسم
                  </label>

                  <input
                    value={values.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    type="text"
                    placeholder="اكتب اسمك"
                    className={`h-14 w-full rounded-2xl border bg-[#fafafa] px-4 text-right text-base text-[#202020] outline-none transition placeholder:text-[#aaa] focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 ${
                      errors.name ? "border-brand-primary" : "border-[#e5e5e5]"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-2 text-sm font-medium text-brand-primary">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#202020]">
                    رقم الموبايل
                  </label>

                  <input
                    value={values.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    type="tel"
                    inputMode="tel"
                    placeholder="اكتب رقم الموبايل"
                    className={`h-14 w-full rounded-2xl border bg-[#fafafa] px-4 text-right text-base text-[#202020] outline-none transition placeholder:text-[#aaa] focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 ${
                      errors.phone ? "border-brand-primary" : "border-[#e5e5e5]"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-sm font-medium text-brand-primary">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-brand-primary font-black text-white shadow-[0_14px_30px_rgba(208,5,7,0.22)] transition hover:bg-[#b90406] disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    "خلّي رفيق يتواصل معايا"
                  )}
                </button>

                {submitError && (
                  <p className="text-center text-sm font-medium text-brand-primary">
                    {submitError}
                  </p>
                )}
              </form>
            </>
          ) : (
         <div className="flex min-h-[300px] flex-col items-center justify-center py-8 text-center">
  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary text-white shadow-[0_16px_36px_rgba(208,5,7,0.28)]">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>

  <h3 className="text-[24px] font-black leading-[1.4] text-[#1f1f1f]">
    تم تسجيل البيانات
  </h3>

  <p className="mt-3 max-w-[320px] text-sm font-medium leading-7 text-[#777]">
    حد من التيم هيتواصل معاك قريب جدًا.
  </p>

  <button
    type="button"
    onClick={onClose}
    className="mt-8 h-12 min-w-[150px] rounded-2xl bg-brand-primary px-10 font-bold text-white transition hover:bg-[#b90406]"
  >
    إغلاق
  </button>
</div>
          )}
        </div>
      </div>
    </Model>
  );
};

export default NewLeadModal;
