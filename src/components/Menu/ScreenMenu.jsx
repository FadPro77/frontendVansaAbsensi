import {
  Button,
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  Modal,
  Form,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { getMenu } from "../../service/menu";
import { createPesanan } from "../../service/pesanan";
import { getLocation } from "../../service/location";

const ScreenMenu = () => {
  const [makanan, setMakanan] = useState([]);
  const [minuman, setMinuman] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [quantities, setQuantities] = useState({});
  const [keranjang, setKeranjang] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const makananData = await getMenu(null, null, "makanan");
        const minumanData = await getMenu(null, null, "minuman");
        setMakanan(makananData || []);
        setMinuman(minumanData || []);
      } catch (error) {
        console.error("Gagal fetch menu:", error);
      }
    };

    const loadKeranjang = () => {
      const saved = localStorage.getItem("keranjang");
      if (saved) setKeranjang(JSON.parse(saved));
    };

    const fetchLocation = async () => {
      try {
        const data = await getLocation();
        setLocations(data || []);
      } catch (err) {
        console.error("Gagal fetch lokasi:", err);
      }
    };

    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    fetchMenu();
    loadKeranjang();
    fetchLocation();
    checkLogin();
  }, []);

  const handleQuantityChange = (menuId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [menuId]: Math.max(0, (prev[menuId] || 0) + delta),
    }));
  };

  const handleAddToCart = (item) => {
    const jumlah = quantities[item.id] || 0;
    if (jumlah <= 0) return alert("Jumlah harus lebih dari 0");

    const existingIndex = keranjang.findIndex((x) => x.menu_id === item.id);
    const newKeranjang = [...keranjang];

    if (existingIndex > -1) {
      newKeranjang[existingIndex].jumlah += jumlah;
    } else {
      newKeranjang.push({ menu_id: item.id, jumlah });
    }

    setKeranjang(newKeranjang);
    localStorage.setItem("keranjang", JSON.stringify(newKeranjang));
    alert("Menu ditambahkan ke keranjang!");
  };

  const openCheckoutForm = () => {
    if (keranjang.length === 0) return alert("Keranjang kosong");
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation || !customAddress) {
      return alert("Harap isi lokasi dan alamat terlebih dahulu.");
    }

    try {
      await createPesanan({
        location_id: parseInt(selectedLocation),
        address: customAddress,
        pesanan_items: keranjang,
      });

      localStorage.removeItem("keranjang");
      setKeranjang([]);
      setShowForm(false);
      alert("Pesanan berhasil dibuat!");
    } catch (err) {
      console.error("Gagal checkout:", err);
      alert("Gagal membuat pesanan");
    }
  };

  const renderMenuItems = (items) =>
    items.map((item) => (
      <Col key={item.id} md={3} sm={6} className="mb-4">
        <Card style={{ borderRadius: "15px", overflow: "hidden" }}>
          <Card.Img
            variant="top"
            src={item.image || "/path/to/default-image.jpg"}
            style={{ width: "100%", height: "16rem", objectFit: "cover" }}
          />
          <Card.Body>
            <Card.Title className="fw-bold">{item.nama}</Card.Title>
            <Card.Text>Rp {item.harga?.toLocaleString("id-ID")}</Card.Text>

            <ButtonGroup className="mb-2">
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(item.id, -1)}
              >
                −
              </Button>
              <Button variant="light" disabled>
                {quantities[item.id] || 0}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(item.id, 1)}
              >
                +
              </Button>
            </ButtonGroup>

            <Button
              variant="success"
              className="w-100 mt-2"
              onClick={() => handleAddToCart(item)}
              disabled={!isLoggedIn}
              title={isLoggedIn ? "" : "Silakan login untuk memilih menu"}
            >
              Pilih
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ));

  const getFilteredItems = () => {
    if (filter === "makanan") return makanan;
    if (filter === "minuman") return minuman;
    return [...makanan, ...minuman];
  };

  return (
    <>
      <section id="menu-2" style={{ paddingTop: "12rem" }}>
        <Container style={{ width: "90%" }}>
          <h2
            className="text-white text-center mb-4"
            style={{ fontSize: "75px", fontFamily: "'Caveat'" }}
          >
            Menu
          </h2>

          <div className="d-flex justify-content-center mb-5 gap-3">
            <Button
              variant={filter === "semua" ? "danger" : "outline-light"}
              onClick={() => setFilter("semua")}
            >
              Semua
            </Button>
            <Button
              variant={filter === "makanan" ? "danger" : "outline-light"}
              onClick={() => setFilter("makanan")}
            >
              Makanan
            </Button>
            <Button
              variant={filter === "minuman" ? "danger" : "outline-light"}
              onClick={() => setFilter("minuman")}
            >
              Minuman
            </Button>
            {isLoggedIn && (
              <Button
                variant="warning"
                size="lg"
                onClick={openCheckoutForm}
                disabled={keranjang.length === 0}
              >
                Checkout ({keranjang.length} item)
              </Button>
            )}
          </div>

          <Row className="mb-5">{renderMenuItems(getFilteredItems())}</Row>
        </Container>
      </section>

      {/* Modal Form Checkout */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Isi Alamat Pengantaran</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Lokasi Gerai</Form.Label>
              <Form.Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                required
              >
                <option value="">-- Pilih Lokasi Gerai --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.address}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Alamat Detail</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan alamat lengkap (opsional tambahan)"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Buat Pesanan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ScreenMenu;
