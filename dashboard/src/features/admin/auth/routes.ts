import { createElement } from "react";
import type { RouteObject } from "react-router-dom";
import SigninPage from "./SigninPage";

export const authRoutes: RouteObject = {
  // index: true,
  path: "signin",
  element: createElement(SigninPage),
};
