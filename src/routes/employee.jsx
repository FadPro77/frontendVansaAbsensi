/* eslint-disable no-unused-vars */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenEmployee from "../components/Employee/ScreenEmployee";
import Protected from "../components/Auth/Protected";

export const Route = createFileRoute("/employee")({
  component: () => (
    <Protected roles={[1]}>
      <Employee />
    </Protected>
  ),
});

function Employee() {
  const [openEmployee, setOpenEmployee] = useState(true);

  return (
    <GuestLayout openEmployee={openEmployee} setOpenEmployee={setOpenEmployee}>
      {openEmployee && <ScreenEmployee />}
    </GuestLayout>
  );
}
