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
  InputGroup,
} from "react-bootstrap";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { profile, register } from "../../service/auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
} from "../../service/employee";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/auth";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  IoDocumentText,
  IoSwapVerticalSharp,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

const ScreenEmployee = () => {
  const { token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [form, setForm] = useState({
    password: "",
    pegawaiId: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [searchNama, setSearchNama] = useState("");
  const [searchNip, setSearchNip] = useState("");
  const [sortNip, setSortNip] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showPassword, setShowPassword] = useState(false);
  const [icon, setIcon] = useState(<IoEyeOffOutline />);

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

  const handleEdit = (item) => {
    setSelectedEmployeeId(item.id);

    setEmployeeForm({
      nip: item.nip,
      nama: item.nama,
      jabatan: item.jabatan,
      status: item.status,
      tanggal_masuk: item.tanggal_masuk?.split("T")[0],
      foto: "",
    });

    setShowEditModal(true);
  };

  const { mutate: updateEmployeeMutate, isPending: loadingUpdate } =
    useMutation({
      mutationFn: ({ id, data }) => updateEmployee(id, data),
      onSuccess: () => {
        setShowEditModal(false);
        queryClient.invalidateQueries(["employees"]);
      },
      onError: (err) => {
        alert(err.message);
      },
    });

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    updateEmployeeMutate({
      id: selectedEmployeeId,
      data: employeeForm,
    });
  };

  const filteredData = data?.data
    ?.filter((item) => {
      const matchNama = item.nama
        .toLowerCase()
        .includes(searchNama.toLowerCase());

      const matchNip = item.nip.toLowerCase().includes(searchNip.toLowerCase());

      return matchNama && matchNip;
    })
    ?.sort((a, b) => {
      if (sortNip === "asc") {
        return a.nip.localeCompare(b.nip);
      }
      if (sortNip === "desc") {
        return b.nip.localeCompare(a.nip);
      }
      return 0;
    });

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEyeToggle = () => {
    if (type === "password") {
      setType("text");
      setIcon(<IoEyeOutline />);
    } else {
      setType("password");
      setIcon(<IoEyeOffOutline />);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchNama, searchNip, sortNip]);

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
                    <Form.Control type="text" value="aktif" disabled />
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
                    <Form.Label>Foto</Form.Label>
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
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />

                      <InputGroup.Text
                        onClick={togglePassword}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit">Simpan</Button>
                </Form>
              </Modal.Body>
            </Modal>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Cari Nama..."
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                />
              </Col>

              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Cari NIP..."
                  value={searchNip}
                  onChange={(e) => setSearchNip(e.target.value)}
                />
              </Col>
            </Row>

            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  style={{ tableLayout: "fixed" }}
                >
                  <thead>
                    <tr className="text-center">
                      <th style={{ width: "50px" }}>No</th>
                      <th style={{ cursor: "pointer", width: "125px" }}>
                        NIP
                        <span
                          className="ms-1"
                          onClick={() =>
                            setSortNip(sortNip === "asc" ? "desc" : "asc")
                          }
                        >
                          <IoSwapVerticalSharp size={20} />
                        </span>
                      </th>
                      <th>Nama</th>
                      <th>Jabatan</th>
                      <th>Status</th>
                      <th>Tanggal Masuk</th>
                      <th>Foto</th>
                      <th style={{ width: "80px" }}>Edit</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData?.map((item, index) => (
                      <tr key={item.id} className="text-center">
                        <td size="sm" className="align-middle">
                          {startIndex + index + 1}
                        </td>
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
                        <td className="text-center align-middle">
                          <Button
                            variant="none"
                            onClick={() => handleEdit(item)}
                          >
                            <IoDocumentText size={40} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                  <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>

                  <span>
                    Halaman {currentPage} dari {totalPages || 1}
                  </span>

                  <Button
                    variant="primary"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
                <Modal
                  show={showEditModal}
                  onHide={() => setShowEditModal(false)}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Pegawai</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Form onSubmit={handleSubmitEdit}>
                      <Form.Group className="mb-3">
                        <Form.Label>NIP</Form.Label>
                        <Form.Control
                          type="text"
                          name="nip"
                          value={employeeForm.nip}
                          onChange={handleEmployeeChange}
                          disabled
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
                        <Form.Label>Foto</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setEmployeeForm({
                              ...employeeForm,
                              foto: e.target.files[0],
                            })
                          }
                        />
                      </Form.Group>

                      <Button type="submit" disabled={loadingUpdate}>
                        {loadingUpdate ? "Loading..." : "Update"}
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ScreenEmployee;
