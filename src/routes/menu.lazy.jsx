/* eslint-disable no-unused-vars */
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import GuestLayout from "../layouts/GuestLayout";
import ScreenMenu from "../components/Menu/ScreenMenu";

export const Route = createLazyFileRoute("/menu")({
  component: Menu,
});

function Menu() {
  const [openMenu, setOpenMenu] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "#1A2129",

        height: "100%",
      }}
    >
      <GuestLayout openMenu={openMenu} setOpenMenu={setOpenMenu}>
        {openMenu && <ScreenMenu />}
      </GuestLayout>
    </div>
  );
}
