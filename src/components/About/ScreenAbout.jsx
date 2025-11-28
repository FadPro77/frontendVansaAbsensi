import {
  Button,
  Container,
  Carousel,
  Row,
  Col,
  ListGroup,
  Card,
  Accordion,
} from "react-bootstrap";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import SelamatDatang from "../../assets/img/Frame-327.png";
import ownerImg from "../../assets/img/image-30.png";
import illustrateMap from "../../assets/img/unsplash_lNf0FmoMsHY.png";

const ScreenAbout = () => {
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
            Tentang Kami
          </h2>
          <Row className="align-items-center mb-5">
            <Col md={8}>
              <p
                className="text-white"
                style={{
                  fontFamily: "'Inter'",
                  width: "40vw",
                  textAlign: "justify",
                  fontSize: "20px",
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </Col>
            <Col md={4} className="text-center text-white">
              <img
                src={ownerImg}
                alt="owner-img"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginBottom: "1rem",
                }}
              />
              <div
                className="text-start"
                style={{ fontFamily: "'Montserrat'", fontSize: "20px" }}
              >
                <strong>Owner</strong>
                <br />
                Sinawang Langit Bagaskara
              </div>
            </Col>
          </Row>
        </Container>

        <Container
          style={{
            borderBottom: "3px solid white",
            width: "90%",
            margin: "auto",
            paddingTop: "5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            className="text-white text-start"
            style={{ fontFamily: "'caveat'", fontSize: "75px" }}
          >
            Lokasi Kedai
          </h2>
          <Row className="align-items-center mb-5">
            <Col md={8}>
              <p
                className="text-white mb-4"
                style={{
                  fontFamily: "'Inter'",
                  width: "40vw",
                  textAlign: "justify",
                  fontSize: "20px",
                }}
              >
                1. Jl. Cengger Ayam No.69, Tulusrejo, Kec. Lowokwaru, Kota
                Malang, Jawa Timur 65141
              </p>
              <p
                className="text-white mb-4"
                style={{
                  fontFamily: "'Inter'",
                  width: "40vw",
                  textAlign: "justify",
                  fontSize: "20px",
                }}
              >
                2. Pujasera Terrarisa , Jl. Saxophone No.53, Tunggulwulung, Kec.
                Lowokwaru, Kota Malang, Jawa Timur 65143
              </p>
              <p
                className="text-white"
                style={{
                  fontFamily: "'Inter'",
                  width: "40vw",
                  textAlign: "justify",
                  fontSize: "20px",
                }}
              >
                3. Kedai Limboto , Jalan Danau Limboto Blok F5J No.16,
                Sawojajar, Kedungkandang, Sawojajar, Kec. Kedungkandang, Kota
                Malang, Jawa Timur 65139
              </p>
            </Col>
            <Col md={4} className="text-center text-white">
              <img
                src={illustrateMap}
                alt="owner-img"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginBottom: "5rem",
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tambahkan section lain seperti menu, kontak, dll */}
    </>
  );
};

export default ScreenAbout;
