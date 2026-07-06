"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import instaPayIcon from "@/src/assets/instaPay.webp";
import plans, { type MonthPlan } from "@/src/data/plans";
import SectionTitle from "./components/SectionTitle";
import FormField from "./components/FormField";
import GradeField from "./components/GradeField";
import DurationCard from "./components/DurationCard";
import PaymentCard from "./components/PaymentCard";
import PaymentInfo from "./components/PaymentInfo";
import ProofUpload from "./components/ProofUpload";
import type { PaymentMethod } from "./types";
import FieldLabel from "./components/FieldLabel";

const durationOptions: MonthPlan[] = plans;

const paymentMethods: PaymentMethod[] = [
  {
    id: "instapay",
    label: "InstaPay",
    description: "تحويل بنكي مباشر",
    icon: instaPayIcon,
  },
  {
    id: "vodafone_cash",
    label: "Vodafone Cash",
    description: "محفظة فودافون كاش",
    icon: "simple-icons:vodafone",
  },
];

const CheckoutForm = () => {
  const router = useRouter();
  const [selectedDurationId, setSelectedDurationId] = useState(1);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod["id"]>("instapay");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [submitMessage, setSubmitMessage] = useState("");

  const selectedDuration = useMemo(
    () =>
      durationOptions.find((option) => option.id === selectedDurationId) ??
      durationOptions[0],
    [selectedDurationId],
  );

  const selectedPaymentData = useMemo(
    () =>
      paymentMethods.find((method) => method.id === selectedPayment) ??
      paymentMethods[0],
    [selectedPayment],
  );

  const handleProofFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("من فضلك ارفع صورة فقط");
      return;
    }

    setProofImage(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!proofImage) {
      alert("من فضلك ارفع صورة الإيصال");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      formData.append("durationId", String(selectedDuration.id));
      formData.append("durationLabel", selectedDuration.label);
      formData.append("price", String(selectedDuration.price));
      formData.append("paymentMethod", selectedPaymentData.label);
      formData.append("proofImage", proofImage);

      if (!formData.get("grade")) {
        formData.append("grade", "ثالثة ثانوي");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });

      if (response.status !== 201) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(
          data?.message ?? "لم نتمكن من إرسال البيانات الآن. حاول مرة أخرى.",
        );
      }

      setSubmitStatus("success");
      setSubmitMessage("تم استلام بياناتك، وهنراجعها ونكلمك قريب جدًا.");
      // event.currentTarget.reset();
      setProofImage(null);
      setSelectedDurationId(1);
      setSelectedPayment("instapay");
      router.replace("/checkout/success");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "لم نتمكن من إرسال البيانات الآن. حاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:p-7">
      <SectionTitle title="بيانات الاشتراك" icon="solar:user-rounded-bold" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <FormField
          label="رقم الهاتف"
          name="phone"
          placeholder="مثال: 01012345678"
          icon="solar:phone-rounded-bold"
        />

        <FormField
          label="رقم ولي الأمر"
          name="parentPhone"
          placeholder="مثال: 01012345678"
          icon="solar:user-id-bold"
        />

        <GradeField />

        <div>
          <FieldLabel label="مدة الاشتراك" icon="solar:calendar-bold" />

          <div className="mt-3 grid grid-cols-3 gap-3">
            {durationOptions.map((option) => (
              <DurationCard
                key={option.id}
                option={option}
                label={option.label}
                isSelected={option.id === selectedDurationId}
                onClick={() => setSelectedDurationId(option.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <FieldLabel label="طريقة الدفع" icon="solar:wallet-money-bold" />

          <div className="mt-3 grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <PaymentCard
                key={method.id}
                method={method}
                isSelected={method.id === selectedPayment}
                onClick={() => setSelectedPayment(method.id)}
              />
            ))}
          </div>
        </div>

        <PaymentInfo selectedPayment={selectedPayment} />

        <ProofUpload
          file={proofImage}
          isDragging={isDragging}
          onDragStateChange={setIsDragging}
          onFileSelect={handleProofFile}
          onRemove={() => setProofImage(null)}
        />

        {submitStatus === "success" ? (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-700">
            {submitMessage}
          </p>
        ) : null}

        {submitStatus === "error" ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700">
            {submitMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-3 rounded-full bg-green-700 px-5 py-4 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {/* <Icon
            icon={
              isSubmitting ? "solar:refresh-bold" : "solar:lock-keyhole-bold"
            }
            className="text-xl"
          /> */}

          <span>{isSubmitting ? "جاري التأكيد..." : "تأكيد الدفع"}</span>

          {/* <span className="rounded-full bg-white/15 px-2 py-1 text-xs">
            {selectedDuration.price} جنيه
          </span> */}
        </button>
      </form>
    </section>
  );
};

export default CheckoutForm;
