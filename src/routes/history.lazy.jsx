import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenHistory from "../components/History/ScreenHistory";

export const Route = createLazyFileRoute("/history")({
  component: History,
});

function History() {
  const [openHistory, setOpenHistory] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "#1A2129",

        height: "100%",
      }}
    >
      <GuestLayout openHistory={openHistory} setOpenHistory={setOpenHistory}>
        {openHistory && <ScreenHistory />}
      </GuestLayout>
    </div>
  );
}
