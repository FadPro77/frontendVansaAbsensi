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
  Modal,
} from "react-bootstrap";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { profile, register } from "../../service/auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
} from "../../service/employee";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/auth";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const ScreenEmployee = () => {
  const { token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [form, setForm] = useState({
    password: "",
    pegawaiId: "",
  });
  const [employeeForm, setEmployeeForm] = useState({
    nip: "",
    nama: "",
    jabatan: "",
    status: "aktif",
    tanggal_masuk: "",
    foto: "",
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    enabled: !!token,
  });

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      setShowForm(false);
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(form);
  };

  const handleEmployeeChange = (e) => {
    setEmployeeForm({
      ...employeeForm,
      [e.target.name]: e.target.value,
    });
  };

  const { mutate: createEmployeeMutate, isPending: loadingCreate } =
    useMutation({
      mutationFn: createEmployee,
      onSuccess: () => {
        setShowAddEmployee(false);
        queryClient.invalidateQueries(["employees"]);
      },
      onError: (err) => {
        alert(err.message);
      },
    });

  const handleSubmitEmployee = (e) => {
    e.preventDefault();
    createEmployeeMutate(employeeForm);
  };

  {
    showForm && (
      <Card className="mb-3">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pegawai ID</Form.Label>
              <Form.Control
                type="number"
                name="pegawaiId"
                value={form.pegawaiId}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Loading..." : "Simpan"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error mengambil data</div>;

  return (
    <section>
      <Container style={{ marginTop: "10rem" }}>
        <Row>
          <Col>
            <h2 className="fw-bold mb-4">Daftar Pegawai</h2>

            <button
              className="btn btn-success mb-3 me-2"
              onClick={() => setShowAddEmployee(true)}
            >
              Tambah Pegawai
            </button>

            <Modal
              show={showAddEmployee}
              onHide={() => setShowAddEmployee(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Tambah Pegawai</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form onSubmit={handleSubmitEmployee}>
                  <Form.Group className="mb-3">
                    <Form.Label>NIP</Form.Label>
                    <Form.Control
                      type="text"
                      name="nip"
                      value={employeeForm.nip}
                      onChange={handleEmployeeChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nama</Form.Label>
                    <Form.Control
                      type="text"
                      name="nama"
                      value={employeeForm.nama}
                      onChange={handleEmployeeChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Jabatan</Form.Label>
                    <Form.Control
                      type="text"
                      name="jabatan"
                      value={employeeForm.jabatan}
                      onChange={handleEmployeeChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={employeeForm.status}
                      onChange={handleEmployeeChange}
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tanggal Masuk</Form.Label>
                    <Form.Control
                      type="date"
                      name="tanggal_masuk"
                      value={employeeForm.tanggal_masuk}
                      onChange={handleEmployeeChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Foto (URL)</Form.Label>
                    <Form.Control
                      type="file"
                      name="foto"
                      accept="image/*"
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          foto: e.target.files[0],
                        })
                      }
                    />
                  </Form.Group>

                  <Button type="submit" disabled={loadingCreate}>
                    {loadingCreate ? "Loading..." : "Simpan"}
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>

            <button
              className="btn btn-primary mb-3"
              onClick={() => setShowForm(!showForm)}
            >
              Buat Akun Pegawai
            </button>

            <Modal show={showForm} onHide={() => setShowForm(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Buat Akun Pegawai</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>NIP</Form.Label>
                    <Form.Select
                      name="pegawaiId"
                      value={form.pegawaiId}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Pegawai</option>
                      {data?.data?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama} - {p.nip}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button type="submit">Simpan</Button>
                </Form>
              </Modal.Body>
            </Modal>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr className="text-center">
                      <th>No</th>
                      <th>NIP</th>
                      <th>Nama</th>
                      <th>Jabatan</th>
                      <th>Status</th>
                      <th>Tanggal Masuk</th>
                      <th>Foto</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data?.data?.map((item, index) => (
                      <tr key={item.id} className="text-center">
                        <td>{index + 1}</td>
                        <td>{item.nip}</td>
                        <td>{item.nama}</td>
                        <td>{item.jabatan}</td>
                        <td>{item.status}</td>
                        <td>{formatDate(item.tanggal_masuk)}</td>
                        <td>
                          <img
                            src={item.foto}
                            alt="Foto"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ScreenEmployee;
