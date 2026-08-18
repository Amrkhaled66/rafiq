import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchStudentByPhoneMutation } from "@/features/admin/student-profile/queries/studentProfileQueries";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";

export default function StudentProfileSearchPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const searchMutation = useSearchStudentByPhoneMutation();

  function handleSearch() {
    const trimmed = phone.trim();
    if (!trimmed) return;

    searchMutation.mutate(trimmed, {
      onSuccess: (student) => {
        navigate(`${student.id}`, { relative: "path" });
      },
    });
  }

  return (
    <section className="dashboard-card mx-auto max-w-lg space-y-6 text-right">
      <div>
        <h1 className="text-foreground text-2xl font-bold">ملف الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">
          أدخل رقم هاتف الطالب للبحث عنه وعرض ملفه الشخصي.
        </p>
      </div>

      <div className="space-y-4">
        <FormInput
          label="رقم هاتف الطالب"
          name="student-phone"
          type="tel"
          placeholder="01xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        {searchMutation.isError ? (
          <p className="text-sm text-red-500">لم يتم العثور على طالب بهذا الرقم.</p>
        ) : null}

        <Button
          onClick={handleSearch}
          isLoading={searchMutation.isPending}
          disabled={!phone.trim()}
          className="w-full"
        >
          بحث
        </Button>
      </div>
    </section>
  );
}
