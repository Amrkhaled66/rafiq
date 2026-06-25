// import type { ReactElement } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// import { urls } from "@/shared/const/urls";
// import { useAuth } from "@/shared/context/authContext";

// export default function OnlyGuest(): ReactElement {
//     const { isAuthenticated } = useAuth();

//     if (isAuthenticated && isAdmin) {
//         const from = (location.state as any)?.from;
//         const to =
//             from?.pathname
//                 ? `${from.pathname ?? ""}${from.search ?? ""}`
//                 : `/${urls.dashBoardUrl}`;

//         return <Navigate to={to} replace />;
//     }

//     return <Outlet />;
// }
