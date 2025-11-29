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
import { getEmployees } from "../../service/employee";
import { profile } from "../../service/auth";
import { getAbsent, getAbsentById, createAbsent } from "../../service/absent";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/auth";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

const ScreenHomepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const today = new Date().toLocaleDateString("en-CA");

  const [liveTime, setLiveTime] = useState("");
  const [dateTime, setDateTime] = useState({
    time: "",
    date: "",
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("id-ID", { hour12: false });
      const date = now.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setDateTime({ time, date });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: profile,
    enabled: token ? true : false,
  });

  const queryTodayAbsent = useQuery({
    queryKey: ["todayAbsent", user?.pegawai?.id, today],
    queryFn: () => getAbsent(user?.pegawai?.id, today),
    enabled: !!user?.pegawai?.id && !!token,
  });

  const {
    data: dataAbsent,
    isSuccess: isSuccessAbsent,
    isError: isErrorAbsent,
  } = useQuery({
    queryKey: ["absent", user?.pegawai?.id],
    queryFn: () => getAbsent(user?.pegawai?.id, null, null, null, null, null),
    enabled: !!token && !!user,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAbsentMasuk = async () => {
    try {
      const now = new Date();

      const jam = now.toLocaleTimeString("id-ID", { hour12: false });
      const tanggal = new Date().toLocaleDateString("en-CA");

      const batas = new Date();
      batas.setHours(9, 0, 0, 0);

      const status = now <= batas ? "hadir" : "telat";

      const payload = {
        pegawaiId: user?.pegawai?.id,
        tanggal,
        jam_masuk: jam,
        status,
        keterangan: "",
      };

      const res = await createAbsent(payload);

      alert("Absensi Masuk berhasil!");

      await queryTodayAbsent.refetch();
    } catch (error) {
      console.error("❌ Error pada Absensi Masuk:", error);
      alert("Gagal melakukan absensi masuk");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data));
    }
  }, [isSuccess, isError, data, dispatch]);

  return (
    <>
      <section>
        <Container style={{ marginTop: "10rem" }}>
          <Card style={{ borderRadius: "15px", overflow: "hidden" }}>
            <Row className="g-1 align-items-center">
              {/* Gambar kiri */}
              <Col md={4}>
                <Card.Img
                  src={user?.pegawai?.foto || "/path/to/default-image.jpg"}
                  style={{
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </Col>

              {/* Text tengah */}
              <Col md={5}>
                <Card.Body>
                  <Card.Title className="mb-5 fw-bolder fs-1">
                    Profil Pegawai
                  </Card.Title>

                  <Card.Text
                    className="fw-semibold fs-3"
                    style={{ marginBottom: "0rem" }}
                  >
                    NAMA:
                  </Card.Text>
                  <Card.Text className="mb-4 fs-5 fw-lighter">
                    {user?.pegawai?.nama}
                  </Card.Text>

                  <Card.Text
                    className="fw-semibold fs-3"
                    style={{ marginBottom: "0rem" }}
                  >
                    JABATAN:
                  </Card.Text>
                  <Card.Text className="mb-4 fs-5 fw-lighter">
                    {user?.pegawai?.jabatan}
                  </Card.Text>

                  <Card.Text
                    className="fw-semibold fs-3"
                    style={{ marginBottom: "0rem" }}
                  >
                    TANGGAL MASUK:
                  </Card.Text>
                  <Card.Text className="mb-4 fs-5 fw-lighter">
                    {formatDate(user?.pegawai?.tanggal_masuk)}
                  </Card.Text>
                </Card.Body>
              </Col>

              <Col md={3} className="text-center px-4">
                <div
                  className="p-3 rounded-4 shadow-sm mb-4"
                  style={{
                    backgroundColor: "#0d6efd",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <span className="fw-light mb-1 fs-5">Waktu Sekarang</span>
                  <h4 className="fw-bolder mb-1 mt-3 fs-4">{dateTime.date}</h4>
                  <h2 className="fw-bold fs-1">{dateTime.time}</h2>
                </div>

                {/* Tombol */}
                <div className="mt-4 d-grid gap-3">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleAbsentMasuk}
                  >
                    Absensi Masuk
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default ScreenHomepage;
