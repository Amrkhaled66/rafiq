export type AppLanguage = "ar" | "en";

export const translations = {
  en: {
    "tabs.home": "Home",
    "tabs.tasks": "My Tasks",
    "tabs.plans": "Plans",
    "tabs.profile": "Profile",
    "auth.eyebrow": "Authentication",
    "auth.title": "Log in",
    "auth.description":
      "This screen will connect to the backend auth flow for student and coach access.",
    "auth.phone": "Phone Number",
    "auth.password": "Password",
    "auth.phonePlaceholder": "01xxxxxxxxx",
    "auth.passwordPlaceholder": "Enter your password",
    "auth.enter": "Enter App",
    "auth.language": "Language",
    "auth.english": "English",
    "auth.arabic": "Arabic",
    "home.eyebrow": "Home",
    "home.title": "Welcome back",
    "home.description":
      "This tab will become the student's overview for subscriptions, tasks, plans, and lesson progress.",
    "home.brand": "Rafiq",
    "home.priorities": "Initial app priorities",
    "home.item1": "Define the first user flows and route structure.",
    "home.item2": "Replace the starter theme tokens with your brand system.",
    "home.item3": "Add shared UI components only when the product needs them.",
    "tasks.eyebrow": "Tasks",
    "tasks.title": "My Tasks",
    "tasks.description":
      "This tab will be driven by plans, tasks, task sessions, and missed task resolutions.",
    "tasks.section1": "Today's tasks",
    "tasks.section2": "In progress sessions",
    "tasks.section3": "Missed tasks follow-up",
    "tasks.placeholder": "Placeholder section ready for task APIs and status widgets.",
    "plans.eyebrow": "Plans",
    "plans.title": "Plans",
    "plans.description":
      "This tab will expose the student's active plan, schedule range, and plan details.",
    "plans.currentPlan": "Current Plan",
    "plans.placeholder":
      "Plan summary, date range, and task breakdown will live here.",
    "profile.eyebrow": "Profile",
    "profile.title": "My Profile",
    "profile.description":
      "This tab will contain account details, subscription summary, and logout actions.",
    "profile.summary": "Profile summary",
    "profile.placeholder":
      "Student info, grade level, assigned coach, and subscription details will appear here.",
    "profile.language": "Language",
    "profile.english": "English",
    "profile.arabic": "Arabic",
    "profile.logout": "Log Out",
  },
  ar: {
    "tabs.home": "الرئيسية",
    "tabs.tasks": "مهامي",
    "tabs.plans": "الخطط",
    "tabs.profile": "الملف الشخصي",
    "auth.eyebrow": "تسجيل الدخول",
    "auth.title": "أهلاً بك",
    "auth.description":
      "هذه الشاشة ستتصل بتدفق تسجيل الدخول للوصول الخاص بالطالب والكوتش.",
    "auth.phone": "رقم الهاتف",
    "auth.password": "كلمة المرور",
    "auth.phonePlaceholder": "01xxxxxxxxx",
    "auth.passwordPlaceholder": "أدخل كلمة المرور",
    "auth.enter": "دخول التطبيق",
    "auth.language": "اللغة",
    "auth.english": "English",
    "auth.arabic": "العربية",
    "home.eyebrow": "الرئيسية",
    "home.title": "أهلاً بعودتك",
    "home.description":
      "هذا التبويب سيكون نظرة الطالب على الاشتراك والمهام والخطط وتقدم الدروس.",
    "home.brand": "رفيق",
    "home.priorities": "أولويات النسخة الأولى",
    "home.item1": "تحديد أول مسارات الاستخدام وهيكل التنقل داخل التطبيق.",
    "home.item2": "استبدال ألوان وتجهيزات البداية بهوية رفيق الفعلية.",
    "home.item3": "إضافة المكونات المشتركة فقط عندما تحتاجها الميزات فعلاً.",
    "tasks.eyebrow": "المهام",
    "tasks.title": "مهامي",
    "tasks.description":
      "هذا التبويب سيعتمد على الخطط والمهام وجلسات التنفيذ ومعالجة المهام الفائتة.",
    "tasks.section1": "مهام اليوم",
    "tasks.section2": "الجلسات الجارية",
    "tasks.section3": "متابعة المهام الفائتة",
    "tasks.placeholder": "قسم تجهيزي جاهز لربطه بواجهات المهام والإحصاءات.",
    "plans.eyebrow": "الخطط",
    "plans.title": "الخطط",
    "plans.description":
      "هذا التبويب سيعرض الخطة الحالية للطالب ومدتها وتفاصيلها.",
    "plans.currentPlan": "الخطة الحالية",
    "plans.placeholder":
      "سيظهر هنا ملخص الخطة والفترة الزمنية وتوزيع المهام.",
    "profile.eyebrow": "الملف الشخصي",
    "profile.title": "ملفي الشخصي",
    "profile.description":
      "هذا التبويب سيحتوي على بيانات الحساب وملخص الاشتراك وإجراءات تسجيل الخروج.",
    "profile.summary": "ملخص الحساب",
    "profile.placeholder":
      "ستظهر هنا بيانات الطالب والصف والكوتش المخصص وتفاصيل الاشتراك.",
    "profile.language": "اللغة",
    "profile.english": "English",
    "profile.arabic": "العربية",
    "profile.logout": "تسجيل الخروج",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
