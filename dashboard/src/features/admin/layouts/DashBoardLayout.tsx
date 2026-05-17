import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Outlet } from "react-router-dom";

import logo from "@/assets/logo1.svg";
import ReusableSidebar, { type SidebarMenuItem } from "@/shared/components/SideBar";
import { useAuth } from "@/shared/context/authContext";
import { can, type Action, type Resource } from "@/shared/auth/can";

type SidebarItem = SidebarMenuItem & {
  requires?: { resource: Resource; action: Action };
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    icon: "material-symbols:grid-view-rounded",
    label: "الرئيسية",
    path: "",
  },
  {
    icon: "mdi:school-outline",
    label: "الطلاب",
    path: "students",
  },
  {
    icon: "fluent:people-team-24-regular",
    label: "المدربين",
    path: "coaches",
    requires: { resource: "coaches", action: "read" },
  },
  {
    icon: "material-symbols:event-busy-outline",
    label: "المهام الفائتة",
    path: "missed-tasks",
  },
  {
    icon: "material-symbols:subscriptions-outline",
    label: "الاشتراكات",
    path: "subscriptions",
    requires: { resource: "subscriptions", action: "read" },
  },
  {
    icon: "material-symbols:timer-outline",
    label: "الجلسات",
    path: "sessions",
  },
];

export default function DashBoardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { authData } = useAuth();

  const sidebarItems = useMemo(
    () =>
      SIDEBAR_ITEMS.filter(
        (item) =>
          !item.requires ||
          can(authData.user, item.requires.resource, item.requires.action),
      ),
    [authData.user],
  );

  return (
    <div className="bg-background text-foreground flex">
      <ReusableSidebar
        isOpen={isSidebarOpen}
        onOpen={() => setIsSidebarOpen(true)}
        onClose={() => setIsSidebarOpen(false)}
        menuItems={sidebarItems}
        basePath=""
        logoSrc={logo}
      />

      <main className="bg-background space-y relative min-w-0 flex-1 p-4 md:p-6 lg:p-8">
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

