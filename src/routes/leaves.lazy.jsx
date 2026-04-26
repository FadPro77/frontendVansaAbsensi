/* eslint-disable no-unused-vars */
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenLeaves from "../components/Leaves/ScreenLeaves";
import Protected from "../components/Auth/Protected";

export const Route = createLazyFileRoute("/leaves")({
  component: () => (
    <Protected roles={[1, 2]}>
      <Leaves />
    </Protected>
  ),
});

function Leaves() {
  const [openLeaves, setOpenLeaves] = useState(true);

  return (
    <GuestLayout openLeaves={openLeaves} setOpenLeaves={setOpenLeaves}>
      {openLeaves && <ScreenLeaves />}
    </GuestLayout>
  );
}
