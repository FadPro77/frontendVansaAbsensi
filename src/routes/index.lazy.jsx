/* eslint-disable no-unused-vars */
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRef } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenHomepage from "../components/Homepage/ScreenHomepage";
import { motion } from "motion/react";
import bgHome from "../assets/img/div-main-container.png";
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
    <div
      style={{
        backgroundImage: `url(${bgHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // minHeight: "100vh",
        // marginTop: "5rem",
      }}
    >
      <GuestLayout
        openHomepage={openHomepage}
        setOpenHomepage={setOpenHomepage}
      >
        {openHomepage && <ScreenHomepage />}
      </GuestLayout>
    </div>
  );
}
