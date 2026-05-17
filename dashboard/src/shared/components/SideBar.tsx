import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import Overlay from "./Overlay";
import Button from "./Button";
import { useAuth } from "@/shared/context/authContext";

export interface SidebarMenuItem {
  icon: string;
  label: string;
  path: string;
}

export interface SidebarUserInfo {
  name?: string;
  email?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  menuItems: SidebarMenuItem[];
  basePath: string;
  userInfo?: SidebarUserInfo;
  logoSrc?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpen,
  menuItems,
  basePath,
  userInfo,
  logoSrc,
}) => {
  const { logout } = useAuth();

  return (
    <>
      <div className="lg:hidden">
        <Overlay isOpen={isOpen} onClick={onClose} />
      </div>

      <aside
        className={`fixed top-0 right-0 z-100 flex min-h-screen flex-col border-l border-black/5 bg-white px-4 py-6 transition-all duration-300 lg:sticky lg:z-50 lg:max-h-screen lg:shadow-none ${
          isOpen
            ? "w-65 translate-x-0"
            : "translate-x-full lg:w-22 lg:translate-x-0"
        }`}
      >
        <div className="sticky top-3 flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            {isOpen ? (
              <div className="flex min-w-0 items-center gap-3 px-2">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={"Rafiq Dashboard"}
                    className="h-12 w-12 shrink-0 object-contain"
                  />
                ) : null}

                <div className="min-w-0">
                  {userInfo?.name ? (
                    <p className="text-foreground truncate text-sm font-medium">
                      {userInfo.name}
                    </p>
                  ) : null}
                  {userInfo?.email ? (
                    <p className="text-subTitle truncate text-xs">
                      {userInfo.email}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <Button type="button" onClick={isOpen ? onClose : onOpen} className="p-2!">
              <Icon
                icon="boxicons:chevron-right"
                className={`animate size-5 ${!isOpen && "rotate-180"}`}
              />
            </Button>
          </div>

          <div className="mt-10 flex-1 overflow-y-auto pb-4">
            <ul className="space-y-2 font-medium">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={`${basePath}${item.path}`}
                    end={item.path === "/" || item.path === ""}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={({ isActive }) =>
                      [
                        "group flex items-center gap-x-3 rounded-sm px-2 py-2 text-sm transition-colors",
                        "justify-start",
                        isActive
                          ? "bg-brand-primary-soft/50 border-r-brand-primary text-brand-primary border-r-4"
                          : "text-subTitle hover:text-brand-primary hover:bg-(--brand-primary-soft)/45",
                      ].join(" ")
                    }
                  >
                    <Icon icon={item.icon} className="size-5 shrink-0" />
                    {isOpen ? <span>{item.label}</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-black/5 pt-4">
          <Button type="button" onClick={logout} className="w-full justify-start">
            <span className="flex items-center gap-2">
              <Icon icon="bx:log-out" className="size-5" />
              {isOpen ? <span>تسجيل الخروج</span> : null}
            </span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

