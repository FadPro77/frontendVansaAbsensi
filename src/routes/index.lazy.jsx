/* eslint-disable no-unused-vars */
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import GuestLayout from "../layouts/GuestLayout";
import ScreenHomepage from "../components/Homepage/ScreenHomepage";

import Protected from "../components/Auth/Protected";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <Protected roles={[1, 2]}>
      <Index />
    </Protected>
  ),
});

function Index() {
  const [openHomepage, setOpenHomepage] = useState(true);

  return (
    <GuestLayout openHomepage={openHomepage} setOpenHomepage={setOpenHomepage}>
      {openHomepage && <ScreenHomepage />}
    </GuestLayout>
  );
}
