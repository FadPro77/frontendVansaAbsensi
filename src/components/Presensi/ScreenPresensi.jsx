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
import { useSelector } from "react-redux";

const ScreenPresensi = () => {
  const { token, user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [absent, setAbsent] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");

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

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateStatus = (item, newStatus) => {
    mutationUpdateAbsent.mutate({
      id: item.id,
      payload: {
        status: newStatus,
        keterangan: item.keterangan || "-",
      },
    });
  };

  const filteredAbsent = absent.filter((item) => {
    const matchName =
      user?.role === 1
        ? item.pegawai?.nama?.toLowerCase().includes(searchName.toLowerCase())
        : true;

    const matchDate = filterDate
      ? new Date(item.tanggal).toISOString().slice(0, 10) === filterDate
      : true;

    const matchStatus = filterStatus ? item.status === filterStatus : true;

    return matchName && matchDate && matchStatus;
  });

  const sortedAbsent = [...filteredAbsent].sort((a, b) => {
    if (sortBy === "masuk-asc") {
      return new Date(a.jam_masuk || 0) - new Date(b.jam_masuk || 0);
    }
    if (sortBy === "masuk-desc") {
      return new Date(b.jam_masuk || 0) - new Date(a.jam_masuk || 0);
    }
    if (sortBy === "pulang-asc") {
      return new Date(a.jam_keluar || 0) - new Date(b.jam_keluar || 0);
    }
    if (sortBy === "pulang-desc") {
      return new Date(b.jam_keluar || 0) - new Date(a.jam_keluar || 0);
    }
    return 0;
  });

  useEffect(() => {
    if (isSuccess) {
      if (Array.isArray(data)) {
        // Jika role == 1 → admin → tampilkan semua
        if (user?.role === 1) {
          setAbsent(data);
        } else {
          // Jika bukan admin → filter sesuai pegawai login
          const filtered = data.filter(
            (item) => item.pegawaiId === user?.pegawai?.id
          );
          setAbsent(filtered);
        }
      } else {
        console.warn("Expected array but received:", data);
        setAbsent([]);
      }
    }
  }, [data, isSuccess, user]);

  return (
    <>
      <section>
        <Container style={{ marginTop: "10rem" }}>
          <Row className="mb-4">
            <Col md={4}>
              {user?.role === 1 && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama pegawai..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              )}
            </Col>

            <Col md={4}>
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </Col>

            <Col md={4}>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="hadir">Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="cuti">Cuti</option>
                <option value="lembur">Lembur</option>
              </select>
            </Col>
          </Row>

          <Row>
            <Col>
              <h2 className="fw-bold mb-4">Riwayat Absensi</h2>

              <Card className="shadow-sm rounded-4">
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr className="text-center">
                        <th>No</th>
                        {user?.role == 1 && <th>Nama Pegawai</th>}
                        <th>Tanggal</th>
                        <th style={{ cursor: "pointer" }}>
                          Jam Masuk
                          <span
                            className="ms-2 text-primary"
                            onClick={() =>
                              setSortBy(
                                sortBy === "masuk-asc"
                                  ? "masuk-desc"
                                  : "masuk-asc"
                              )
                            }
                          >
                            ⇅
                          </span>
                        </th>

                        <th style={{ cursor: "pointer" }}>
                          Jam Pulang
                          <span
                            className="ms-2 text-primary"
                            onClick={() =>
                              setSortBy(
                                sortBy === "pulang-asc"
                                  ? "pulang-desc"
                                  : "pulang-asc"
                              )
                            }
                          >
                            ⇅
                          </span>
                        </th>

                        <th>Status</th>
                        {user?.role !== 1 && <th>Pulang</th>}
                      </tr>
                    </thead>

                    <tbody>
                      {sortedAbsent.length > 0 ? (
                        sortedAbsent.map((item, index) => (
                          <tr key={item.id} className="text-center">
                            <td>{index + 1}</td>
                            {user?.role == 1 && (
                              <td>{item.pegawai?.nama || "-"}</td>
                            )}
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
                              {user?.role === 1 ? (
                                <select
                                  className="form-select form-select-sm"
                                  value={item.status}
                                  onChange={(e) =>
                                    handleUpdateStatus(item, e.target.value)
                                  }
                                >
                                  <option value="hadir">Hadir</option>
                                  <option value="telat">Telat</option>
                                  <option value="izin">Izin</option>
                                  <option value="sakit">Sakit</option>
                                  <option value="cuti">Cuti</option>
                                  <option value="lembur">Lembur</option>
                                </select>
                              ) : (
                                item.status
                              )}
                            </td>

                            {user?.role !== 1 && (
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
                            )}
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
