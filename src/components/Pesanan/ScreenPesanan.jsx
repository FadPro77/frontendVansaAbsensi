import { Button, Container, Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { getMenu } from "../../service/menu";
import { getPesanan, deletePesanan } from "../../service/pesanan";
import { getLocation } from "../../service/location";
import { createPayment, getPayment } from "../../service/payment";

const ScreenPesanan = () => {
  const [makanan, setMakanan] = useState([]);
  const [minuman, setMinuman] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pesananList, setPesananList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const makananData = await getMenu(null, null, "makanan");
        const minumanData = await getMenu(null, null, "minuman");
        const lokasiData = await getLocation();
        const pesananData = await getPesanan();
        const paymentList = await getPayment();

        const filtered = pesananData?.filter(
          (p) => p.status === "pending" || p.status === "diantar"
        );

        const merged = filtered.map((p) => {
          const relatedPayment = paymentList.find(
            (pay) => pay.pesanan_id === p.id
          );
          return { ...p, payment: relatedPayment || null };
        });

        setMakanan(makananData || []);
        setMinuman(minumanData || []);
        setLocations(lokasiData || []);
        setPesananList(merged || []);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();
    fetchData();
  }, []);

  const refreshPesanan = async () => {
    const data = await getPesanan();
    const paymentList = await getPayment();

    const filtered = data?.filter(
      (p) => p.status === "pending" || p.status === "diantar"
    );

    const merged = filtered.map((p) => {
      const relatedPayment = paymentList.find((pay) => pay.pesanan_id === p.id);
      return { ...p, payment: relatedPayment || null };
    });

    setPesananList(merged || []);
  };

  const handleRemovePesanan = async (id) => {
    try {
      await deletePesanan(id);
      await refreshPesanan();
    } catch (err) {
      alert("Gagal menghapus pesanan.");
      console.error(err);
    }
  };

  const handleBayar = async (pesanan_id) => {
    try {
      await createPayment({
        pesanan_id,
        metode: "tunai",
        status: "success",
      });
      await refreshPesanan();
    } catch (err) {
      alert("Gagal melakukan pembayaran.");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "diantar":
        return "info";
      default:
        return "secondary";
    }
  };

  const renderPesananCards = () => {
    if (!pesananList.length)
      return <p className="text-white">Tidak ada pesanan yang ditampilkan.</p>;

    return pesananList.map((pesanan) => (
      <Card key={pesanan.id} className="mb-4">
        <Card.Header>
          <strong>Pesanan Anda</strong> - Status:{" "}
          <span className={`text-${getStatusColor(pesanan.status)}`}>
            {pesanan.status}
          </span>
          <span className="float-end">
            Pembayaran:{" "}
            {pesanan.payment ? (
              pesanan.payment.status === "success" ? (
                <span className="text-success fw-bold">Sudah Dibayar</span>
              ) : (
                <span
                  className={`text-${getStatusColor(pesanan.payment.status)}`}
                >
                  {pesanan.payment.status}
                </span>
              )
            ) : (
              <span className="text-danger">Belum Dibayar</span>
            )}
          </span>
        </Card.Header>

        <Card.Body>
          <Row>
            {pesanan.pesanan_items.map((item, idx) => (
              <Col key={idx} md={3} sm={6} className="mb-3">
                <Card>
                  <Card.Img
                    variant="top"
                    src={item.menu.image}
                    style={{ height: "10rem", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {item.menu.nama}
                    </Card.Title>
                    <Card.Text>Jumlah: {item.jumlah}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-3 d-flex justify-content-end">
            <Button
              variant="danger"
              onClick={() => handleRemovePesanan(pesanan.id)}
            >
              Hapus
            </Button>

            {!pesanan.payment && (
              <Button
                variant="primary"
                className="ms-2"
                onClick={() => handleBayar(pesanan.id)}
              >
                Bayar
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <>
      <section id="menu-2" style={{ paddingTop: "12rem" }}>
        <Container style={{ width: "90%" }}>
          <h2
            className="text-white text-center mb-4"
            style={{ fontSize: "75px", fontFamily: "'Caveat'" }}
          >
            Pesanan Anda
          </h2>

          {/* 🔥 PESANAN PENDING & DIANTAR */}
          <div className="mb-5">{renderPesananCards()}</div>
        </Container>
      </section>
    </>
  );
};

export default ScreenPesanan;
