import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer } from "react-toastify";

export const Route = createRootRoute({
  component: () => (
    <Outlet>
      <TanStackRouterDevtools />
      <ToastContainer theme="colored" />
    </Outlet>
  ),
});
