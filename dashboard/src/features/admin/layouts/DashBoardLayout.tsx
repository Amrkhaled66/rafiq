import { useState } from "react";
import { Icon } from "@iconify/react";
import { Outlet } from "react-router-dom";
import logo from "@/assets/logo1.svg";
import ReusableSidebar, {
  type SidebarMenuItem,
} from "@/shared/components/SideBar";

const sidebarItems: SidebarMenuItem[] = [
  {
    icon: "material-symbols:grid-view-rounded",
    label: "الرئيسية",
    path: "/",
  },
  {
    icon: "material-symbols:analytics-outline",
    label: "التحليلات",
    path: "analytics",
  },
  {
    icon: "mdi:school-outline",
    label: "الطلاب",
    path: "students",
  },
  {
    icon: "fluent:people-team-24-regular",
    label: "المدربين",
    path: "trainers",
  },
  {
    icon: "material-symbols:subscriptions-outline",
    label: "الاشتراكات",
    path: "subscriptions",
  },
  {
    icon: "material-symbols:event-busy-outline",
    label: "المهام الفائتة",
    path: "missed-tasks",
  },
  {
    icon: "material-symbols:timer-outline",
    label: "الجلسات النشطة",
    path: "active-sessions",
  },
];

export default function DashBoardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div dir="rtl" className="bg-background text-foreground flex">
      <ReusableSidebar
        isOpen={isSidebarOpen}
        onOpen={() => setIsSidebarOpen(true)}
        onClose={() => setIsSidebarOpen(false)}
        menuItems={sidebarItems}
        basePath=""
        logoSrc={logo}
      />

      <main className="bg-background space-y lg:p-8 flex-1 min-w-0 p-4 md:p-6">
        {/* <div className="min-h-18  drop-shadow-md bg-white">
        </div> */}
        <div className="mb-4 flex lg:hidden">
          <button type="button" onClick={() => setIsSidebarOpen(true)}>
            <Icon icon="material-symbols:menu-rounded" className="size-9" />
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
