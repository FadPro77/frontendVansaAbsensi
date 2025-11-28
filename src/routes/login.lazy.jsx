import { createLazyFileRoute } from "@tanstack/react-router";
import LoginScreen from "../components/Auth/LoginScreen";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  return <LoginScreen />;
}
