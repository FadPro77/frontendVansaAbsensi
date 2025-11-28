import { createLazyFileRoute } from "@tanstack/react-router";
import RegisterScreen from "../components/Auth/RegisterScreen";

export const Route = createLazyFileRoute("/register")({
  component: Register,
});

function Register() {
  return <RegisterScreen />;
}
