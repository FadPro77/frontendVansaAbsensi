/* eslint-disable no-unused-vars */
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRef } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenAbout from "../components/About/ScreenAbout";
import { motion } from "motion/react";
import bgHome from "../assets/img/div-main-container.png";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const [openAbout, setOpenAbout] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "#1A2129",

        height: "100%",
      }}
    >
      <GuestLayout openAbout={openAbout} setOpenAbout={setOpenAbout}>
        {openAbout && <ScreenAbout />}
      </GuestLayout>
    </div>
  );
}
