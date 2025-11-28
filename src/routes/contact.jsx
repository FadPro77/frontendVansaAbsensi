/* eslint-disable no-unused-vars */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRef } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenContact from "../components/Contact/ScreenContact";
import { motion } from "motion/react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  const [openContact, setOpenContact] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "#1A2129",

        height: "100%",
      }}
    >
      <GuestLayout openContact={openContact} setOpenContact={setOpenContact}>
        {openContact && <ScreenContact />}
      </GuestLayout>
    </div>
  );
}
