import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import ScreenPesanan from "../components/Pesanan/ScreenPesanan";

export const Route = createLazyFileRoute("/pesanan")({
  component: Pesanan,
});

function Pesanan() {
  const [openPesanan, setOpenPesanan] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "#1A2129",

        height: "100%",
      }}
    >
      <GuestLayout openPesanan={openPesanan} setOpenPesanan={setOpenPesanan}>
        {openPesanan && <ScreenPesanan />}
      </GuestLayout>
    </div>
  );
}
