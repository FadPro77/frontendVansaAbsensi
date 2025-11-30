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
  Form,
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
import { getLeaves, getLeavesById, createLeaves } from "../../service/leaves";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/auth";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Input } from "postcss";

const ScreenLeaves = () => {
  const { token, user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    jenis: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    alasan: "",
  });

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["leaves"],
    queryFn: () => getLeaves(),
    enabled: !!token,
  });

  const mutationCreateLeaves = useMutation({
    mutationFn: (payload) => createLeaves(payload),
    onSuccess: () => {
      alert("Pengajuan cuti berhasil dikirim!");
      queryClient.invalidateQueries(["leaves"]);
      setFormData({
        jenis: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        alasan: "",
      });
    },
    onError: (err) => {
      console.error("Gagal mengajukan cuti:", err);
      alert("Gagal mengajukan cuti");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.jenis ||
      !formData.tanggal_mulai ||
      !formData.tanggal_selesai
    ) {
      return alert("Semua field wajib diisi!");
    }

    const payload = {
      pegawaiId: user?.pegawai?.id,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      jenis: formData.jenis,
      status_pengajuan: "menunggu",
      alasan: formData.alasan,
    };

    mutationCreateLeaves.mutate(payload);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "text-warning fw-semibold"; // kuning
      case "disetujui":
        return "text-success fw-semibold"; // hijau
      case "ditolak":
        return "text-danger fw-semibold"; // merah
      default:
        return "";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (Array.isArray(data)) {
        // Filter sesuai pegawai login
        const filtered = data.filter(
          (item) => item.pegawaiId === user?.pegawai?.id
        );
        setLeaves(filtered);
      } else {
        console.warn("Expected array but received:", data);
        setLeaves([]);
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
      <section style={{ marginTop: "10rem" }}>
        <Container>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <fieldset>
                  <legend className="fw-bold mb-3 fs-2">FORMULIR CUTI</legend>

                  {/* Jenis Izin */}
                  <div className="mb-3">
                    <label className="form-label">Jenis Izin</label>
                    <select
                      className="form-select"
                      value={formData.jenis}
                      onChange={(e) =>
                        setFormData({ ...formData, jenis: e.target.value })
                      }
                    >
                      <option value="">-- Pilih Jenis --</option>
                      <option value="izin">Izin</option>
                      <option value="sakit">Sakit</option>
                      <option value="cuti">Cuti</option>
                    </select>
                  </div>

                  {/* Tanggal Mulai */}
                  <div className="mb-3">
                    <label className="form-label">Tanggal Mulai</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.tanggal_mulai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggal_mulai: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Tanggal Selesai */}
                  <div className="mb-3">
                    <label className="form-label">Tanggal Selesai</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.tanggal_selesai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggal_selesai: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Alasan */}
                  <div className="mb-3">
                    <label className="form-label">Alasan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.alasan}
                      onChange={(e) =>
                        setFormData({ ...formData, alasan: e.target.value })
                      }
                      placeholder="Masukkan alasan cuti"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>

      <section style={{ marginTop: "5rem", marginBottom: "10rem" }}>
        <Container>
          <Row>
            <Col>
              <h2 className="fw-bold mb-4">Riwayat Cuti</h2>
              <Card className="shadow-sm rounded-4">
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr className="text-center">
                        <th>No</th>
                        <th>Tanggal Mulai</th>
                        <th>Tanggal Selesai</th>
                        <th>Jenis</th>
                        <th>Status Pengajuan</th>
                        <th>Alasan</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaves.length > 0 ? (
                        leaves.map((item, index) => (
                          <tr key={item.id} className="text-center">
                            <td>{index + 1}</td>
                            <td>{formatDate(item.tanggal_mulai)}</td>
                            <td>{formatDate(item.tanggal_selesai)}</td>
                            <td className="fw-semibold text-primary">
                              {item.jenis}
                            </td>
                            <td
                              className={getStatusColor(item.status_pengajuan)}
                            >
                              {item.status_pengajuan}
                            </td>
                            <td className="fw-semibold text-primary">
                              {item.alasan}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            Tidak ada data cuti ditemukan.
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

export default ScreenLeaves;
