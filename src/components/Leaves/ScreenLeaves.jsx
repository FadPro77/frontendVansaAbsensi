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
  getLeaves,
  getLeavesById,
  createLeaves,
  updateLeaves,
} from "../../service/leaves";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/auth";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Input } from "postcss";

const ScreenLeaves = () => {
  const { token, user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchName, setSearchName] = useState("");

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

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredLeaves = leaves.filter((item) => {
    const matchName =
      user?.role === 1
        ? item.pegawai?.nama?.toLowerCase().includes(searchName.toLowerCase())
        : true;

    const matchStatus = filterStatus
      ? item.status_pengajuan === filterStatus
      : true;

    let matchDate = true;
    if (filterDate) {
      const searchDate = new Date(filterDate);
      const startDate = new Date(item.tanggal_mulai);
      const endDate = new Date(item.tanggal_selesai);

      matchDate = searchDate >= startDate && searchDate <= endDate;
    }

    return matchName && matchStatus && matchDate;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateLeaves(id, { status_pengajuan: newStatus });
      alert("Status berhasil diperbarui!");
      queryClient.invalidateQueries(["leaves"]);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui status");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (Array.isArray(data)) {
        if (user?.role === 1) {
          setLeaves(data);
        } else {
          const filtered = data.filter(
            (item) => item.pegawaiId === user?.pegawai?.id
          );
          setLeaves(filtered);
        }
      } else {
        console.warn("Expected array but received:", data);
        setLeaves([]);
      }
    }
  }, [data, isSuccess, user]);

  return (
    <>
      <section style={{ marginTop: "10rem" }}>
        <Container>
          {user?.role === 2 && (
            <Card id="form-leaves" className="mb-4 shadow-sm rounded-4">
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
          )}
          <div className="row g-3 mb-4">
            {/* Search Nama Pegawai (hanya admin) */}
            {user?.role === 1 && (
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Search Nama Pegawai
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama pegawai..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            )}

            {/* Filter Status */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Filter Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            {/* Filter Tanggal */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Filter Tanggal</label>
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
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

                        {user?.role == 1 && <th>Nama Pegawai</th>}
                        <th>Tanggal Mulai</th>
                        <th>Tanggal Selesai</th>
                        <th>Jenis</th>
                        <th>Status Pengajuan</th>
                        <th>Alasan</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredLeaves.length > 0 ? (
                        filteredLeaves.map((item, index) => (
                          <tr key={item.id} className="text-center">
                            <td>{index + 1}</td>
                            {user?.role == 1 && (
                              <td>{item.pegawai?.nama || "-"}</td>
                            )}
                            <td>{formatDate(item.tanggal_mulai)}</td>
                            <td>{formatDate(item.tanggal_selesai)}</td>
                            <td className="fw-semibold text-primary">
                              {item.jenis}
                            </td>
                            <td>
                              {user?.role === 1 ? (
                                <select
                                  className="form-select form-select-sm fw-semibold"
                                  value={item.status_pengajuan}
                                  onChange={(e) =>
                                    handleUpdateStatus(item.id, e.target.value)
                                  }
                                >
                                  <option value="menunggu">Menunggu</option>
                                  <option value="disetujui">Disetujui</option>
                                  <option value="tolak">Tolak</option>
                                </select>
                              ) : (
                                <span
                                  className={getStatusColor(
                                    item.status_pengajuan
                                  )}
                                >
                                  {item.status_pengajuan}
                                </span>
                              )}
                            </td>

                            <td className="fw-semibold text-primary">
                              {item.alasan}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
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
