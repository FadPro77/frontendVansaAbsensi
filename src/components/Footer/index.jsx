import { Container, Row, Col } from "react-bootstrap";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Threads,
} from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#1A2129", color: "white" }}>
      <Container className="py-4">
        {/* Bagian atas */}
        <Row className="text-start mb-4 mt-5">
          <Col>
            <h5 className="mb-1 fw-bold" style={{ fontFamily: "'Montserrat'" }}>
              Get in Touch with Us for
            </h5>
            <h5 className=" fw-bold" style={{ fontFamily: "'Montserrat'" }}>
              Your Path to Success
            </h5>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="d-flex justify-content-center gap-4 flex-wrap">
            <div className="d-flex gap-3">
              <Facebook className="me-3" style={{ color: "#EC492E" }} />
              <Twitter className="me-3" style={{ color: "#EC492E" }} />
              <Instagram className="me-3" style={{ color: "#EC492E" }} />
              <Linkedin className="me-3" style={{ color: "#EC492E" }} />
              <Threads style={{ color: "#EC492E" }} />
            </div>
          </Col>
        </Row>

        {/* Navigation */}
        <Row className="mb-4">
          <Col>
            <a
              href="/"
              className="text-white text-decoration-none me-4"
              style={{ fontFamily: "'Montserrat'" }}
            >
              Home
            </a>
            <a
              href="/about"
              className="text-white text-decoration-none me-4"
              style={{ fontFamily: "'Montserrat'" }}
            >
              Tentang Kami
            </a>
            <a
              href="/menu"
              className="text-white text-decoration-none me-4"
              style={{ fontFamily: "'Montserrat'" }}
            >
              Menu
            </a>
            <a
              href="/services"
              className="text-white text-decoration-none me-4"
              style={{ fontFamily: "'Montserrat'" }}
            >
              Layanan
            </a>
            <a
              href="/contact"
              className="text-white text-decoration-none "
              style={{ fontFamily: "'Montserrat'" }}
            >
              Kontak
            </a>
          </Col>
        </Row>
        {/* Login & Social Media */}
        {/* Copyright */}
        <Row>
          <Col className="text-center">
            <small>© 2025 Kedai Om Him · All Rights Reserved</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
