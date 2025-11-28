import {
  Button,
  Container,
  Carousel,
  Row,
  Col,
  ListGroup,
  Card,
  Accordion,
  Form,
} from "react-bootstrap";
import logoNav from "../../assets/img/om_him-removebg-preview 1.png";
import { Facebook, Twitter, Instagram, Whatsapp } from "react-bootstrap-icons";
import emailjs from "@emailjs/browser";

const ScreenContact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_62vkd17",
        "template_vh7ue87",
        e.target,
        "Ug5gxsrlikdBdjzvM"
      )
      .then(
        () => {
          alert("Pesan berhasil dikirim!");
        },
        () => {
          alert("Gagal mengirim pesan.");
        }
      );
  };

  return (
    <>
      <section
        id="about-2"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Konten utama */}
        <Container
          style={{
            width: "90%",
            margin: "auto",
            marginTop: "10rem",
            paddingTop: "5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            className="text-white text-center mb-5"
            style={{ fontFamily: "'caveat'", fontSize: "75px" }}
          >
            Kontak
          </h2>
          <Row className="align-items-center mb-5">
            <Col md={8}>
              <h3
                className="text-white text-center mb-5"
                style={{ fontFamily: "'caveat'", fontSize: "75px" }}
              >
                Hubungi Kami
              </h3>
              <p
                className="text-white"
                style={{
                  fontFamily: "'Inter'",
                  width: "40vw",
                  textAlign: "justify",
                  fontSize: "20px",
                }}
              >
                Bila ada saran dan kritik untuk kedai ini, Kami mohon mengisi
                form di bawah ini:
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 w-75" controlId="formNama">
                  <Form.Control type="text" placeholder="Nama" name="nama" />
                </Form.Group>
                <Form.Group className="mb-3 w-75" controlId="formEmail">
                  <Form.Control type="email" placeholder="Email" name="email" />
                </Form.Group>
                <Form.Group className="mb-3 w-75" controlId="formNoTelp">
                  <Form.Control type="text" placeholder="No.Telp" name="telp" />
                </Form.Group>
                <Form.Group className="mb-3 w-75" controlId="formSubject">
                  <Form.Control
                    type="text"
                    placeholder="Subject"
                    name="subject"
                  />
                </Form.Group>
                <Form.Group className="mb-3 w-75" controlId="formPesan">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Pesan Anda"
                    name="pesan"
                  />
                </Form.Group>
                <Button variant="danger" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>

            {/* Formulir Kontak */}
            <Col md={4} className="text-center text-white">
              <img
                src={logoNav}
                alt="logo"
                style={{
                  width: "25rem",
                  height: "25rem",
                  marginBottom: "1rem",
                }}
              />
              <div
                className="text-start"
                style={{ fontFamily: "'Montserrat'", fontSize: "20px" }}
              >
                <div className="mb-3">
                  <Facebook className="me-5" />
                  <span className="text-white fs-6">@kedaiomhim</span>
                </div>
                <a
                  href="https://x.com/KedaiOmhim?t=DEv6gZs625MnDZ9tRxGLOQ&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <div className="mb-3 d-flex align-items-center">
                    <Twitter className="me-5 text-white" />
                    <span className="text-white fs-6">@kedaiomhim</span>
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/kedaiomhim?igsh=dzRxOGhpd2lxMDls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <div className="mb-3 d-flex align-items-center">
                    <Instagram className="me-5 text-white" />
                    <span className="text-white fs-6">@kedaiomhim</span>
                  </div>
                </a>

                <div className="mb-3">
                  <Whatsapp className="me-5" />
                  <span className="text-white fs-6">085933100004</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tambahkan section lain seperti menu, kontak, dll */}
    </>
  );
};

export default ScreenContact;
