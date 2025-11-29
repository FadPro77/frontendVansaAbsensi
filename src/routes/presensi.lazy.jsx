/* eslint-disable no-unused-vars */
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRef } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenPresensi from "../components/Presensi/ScreenPresensi";
import { motion } from "motion/react";
import bgHome from "../assets/img/div-main-container.png";
import Protected from "../components/Auth/Protected";

export const Route = createLazyFileRoute("/presensi")({
  component: () => (
    <Protected roles={[1, 2]}>
      <Index />
    </Protected>
  ),
});

function Index() {
  const [openPresensi, setOpenPresensi] = useState(true);

  return (
    <GuestLayout openPresensi={openPresensi} setOpenPresensi={setOpenPresensi}>
      {openPresensi && <ScreenPresensi />}
    </GuestLayout>
  );
}
