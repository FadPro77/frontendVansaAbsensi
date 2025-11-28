import { Container, Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { getMenu } from "../../service/menu";
import { getPesanan } from "../../service/pesanan";
import { getLocation } from "../../service/location";
import { getPayment } from "../../service/payment";

const ScreenHistory = () => {
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

        const merged = pesananData.map((p) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "diantar":
        return "info";
      case "selesai":
        return "success";
      case "dibatalkan":
        return "danger";
      default:
        return "secondary";
    }
  };

  const renderPesananCards = () => {
    if (!pesananList.length)
      return <p className="text-white">Tidak ada pesanan yang ditampilkan.</p>;

    return pesananList.map((pesanan) => {
      const total = pesanan.pesanan_items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      return (
        <Card key={pesanan.id} className="mb-4">
          <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div>
              <strong>Pesanan Anda</strong> - Status:{" "}
              <span className={`text-${getStatusColor(pesanan.status)}`}>
                {pesanan.status}
              </span>
            </div>

            <div className="text-center my-2 my-md-0">
              Total:{" "}
              <span className="fw-bold">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <div>
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
            </div>
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
                      <Card.Text>
                        Harga: Rp {item.subtotal.toLocaleString("id-ID")}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      );
    });
  };

  return (
    <section id="menu-2" style={{ paddingTop: "12rem" }}>
      <Container style={{ width: "90%" }}>
        <h2
          className="text-white text-center mb-4"
          style={{ fontSize: "75px", fontFamily: "'Caveat'" }}
        >
          Riwayat Pesanan Anda
        </h2>

        {/* 🔥 TAMPILKAN SEMUA PESANAN */}
        <div className="mb-5">{renderPesananCards()}</div>
      </Container>
    </section>
  );
};

export default ScreenHistory;
