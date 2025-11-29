import {
  Button,
  Container,
  Carousel,
  Row,
  Col,
  ListGroup,
  Card,
  Accordion,
  Table,
} from "react-bootstrap";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { profile } from "../../service/auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getAbsent,
  getAbsentById,
  createAbsent,
  updateAbsent,
} from "../../service/absent";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/auth";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const ScreenPresensi = () => {
  const { token, user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [absent, setAbsent] = useState([]);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["absent"],
    queryFn: () => getAbsent(),
    enabled: !!token,
  });

  const mutationUpdateAbsent = useMutation({
    mutationFn: ({ id, payload }) => updateAbsent(id, payload),
    onSuccess: () => {
      // Refresh data absensi
      queryClient.invalidateQueries(["absent"]);
    },
    onError: (err) => {
      console.error("Gagal update absent:", err);
    },
  });

  const handleAbsentPulang = (item) => {
    // Jika sudah pulang, jangan izinkan update lagi
    if (item.jam_keluar) {
      alert("Anda sudah melakukan absensi pulang hari ini.");
      return;
    }

    mutationUpdateAbsent.mutate({
      id: item.id,
      payload: {
        status: "hadir",
        keterangan: "Pulang",
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      if (Array.isArray(data)) {
        // Filter sesuai pegawai login
        const filtered = data.filter(
          (item) => item.pegawaiId === user?.pegawai?.id
        );
        setAbsent(filtered);
      } else {
        console.warn("Expected array but received:", data);
        setAbsent([]);
      }
    }
  }, [data, isSuccess, user]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <section>
        <Container style={{ marginTop: "10rem" }}>
          <Row>
            <Col>
              <h2 className="fw-bold mb-4">Riwayat Absensi</h2>

              <Card className="shadow-sm rounded-4">
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr className="text-center">
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Jam Masuk</th>
                        <th>Jam Pulang</th>
                        <th>Status</th>
                        <th>Pulang</th>
                      </tr>
                    </thead>

                    <tbody>
                      {absent.length > 0 ? (
                        absent.map((item, index) => (
                          <tr key={item.id} className="text-center">
                            <td>{index + 1}</td>
                            <td>{formatDate(item.tanggal)}</td>
                            <td>
                              {item.jam_masuk
                                ? new Date(item.jam_masuk).toLocaleTimeString(
                                    "id-ID",
                                    { hour12: false }
                                  )
                                : "-"}
                            </td>

                            <td>
                              {item.jam_keluar
                                ? new Date(item.jam_keluar).toLocaleTimeString(
                                    "id-ID",
                                    { hour12: false }
                                  )
                                : "-"}
                            </td>
                            <td className="fw-semibold text-primary">
                              {item.status}
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleAbsentPulang(item)}
                                disabled={!!item.jam_keluar} // disable jika sudah pulang
                              >
                                {item.jam_keluar
                                  ? "Sudah Pulang"
                                  : "Absensi Pulang"}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            Tidak ada data absensi ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ScreenPresensi;
