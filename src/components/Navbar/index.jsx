import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "@tanstack/react-router";
import logoNav from "../../assets/img/logoNoBg.png";
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../../redux/slices/auth";
import { profile, changePassword } from "../../service/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Modal, Form, Button } from "react-bootstrap";
import { IoEyeOutline, IoEyeOffOutline, IoArrowBack } from "react-icons/io5";
import "./navbar.css";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [icon, setIcon] = useState(<IoEyeOffOutline />);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = useCallback(() => {
    dispatch(setUser(null));
    dispatch(setToken(null));
    navigate({ to: "/login" });
  }, [dispatch, navigate]);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: profile,
    enabled: token ? true : false,
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data));
    } else if (isError) {
      handleLogout();
    }
  }, [isSuccess, isError, data, dispatch, handleLogout]);

  const logout = (event) => {
    event.preventDefault();

    handleLogout();
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const { mutate: changePasswordMutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      alert("Password berhasil diubah");
      setShowPasswordModal(false);
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleSubmitPassword = (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Password tidak sama");
      return;
    }

    setShowPasswordModal(false);

    setShowConfirmModal(true);
  };

  const handleConfirmChangePassword = () => {
    changePasswordMutate(passwordForm);
    setShowConfirmModal(false);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  return (
    <>
      {["xxl"].map((expand) => (
        <Navbar
          collapseOnSelect
          expand="md"
          bg="dark"
          variant="dark"
          className="py-3"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            backgroundColor: "rgba(18, 17, 17, 0.88)",
          }}
        >
          <Container>
            <div className="d-flex align-items-center me-auto">
              <Navbar.Brand
                as={Link}
                to="/"
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={logoNav}
                  className="img-fluid d-inline-block"
                  alt="Logo dummy"
                  style={{ maxHeight: "60px" }}
                />

                <span className="ms-2 fs-6 fw-bold text-white">
                  PT VANSA NUSA PROPERTI
                </span>
              </Navbar.Brand>
            </div>

            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              className="custom-toggler"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mx-auto ">
                <Nav.Link
                  as={Link}
                  to="/"
                  style={{ cursor: "pointer" }}
                  className="fw-bold text-white me-5"
                >
                  Beranda
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/presensi"
                  style={{ cursor: "pointer" }}
                  className="fw-bold text-white me-5"
                >
                  Presensi
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/leaves"
                  style={{ cursor: "pointer" }}
                  className="fw-bold text-white me-5"
                >
                  Cuti
                </Nav.Link>
                {user && user.role === 1 && (
                  <Nav.Link
                    as={Link}
                    to="/employee"
                    style={{ cursor: "pointer" }}
                    className="fw-bold text-white me-5"
                  >
                    Pegawai
                  </Nav.Link>
                )}
              </Nav>
              <Nav>
                {user ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="light"
                      className="d-flex align-items-center px-3 py-2 rounded-pill border-0"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        fontWeight: "bold",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Image
                        src={user?.pegawai?.foto}
                        fluid
                        className="me-3"
                        style={{
                          maxHeight: "40px",
                          display: "inline-block",
                          overflow: "hidden",
                          borderRadius: "50%",
                        }}
                      />

                      {user?.nama_lengkap ?? ""}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setShowPasswordModal(true)}>
                        Ganti Password
                      </Dropdown.Item>

                      <Modal
                        show={showPasswordModal}
                        onHide={() => setShowPasswordModal(false)}
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Ganti Password</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                          <Form onSubmit={handleSubmitPassword}>
                            <Form.Group className="mb-3 position-relative">
                              <Form.Label>Password Baru</Form.Label>
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                              />

                              <span
                                onClick={togglePassword}
                                style={{
                                  position: "absolute",
                                  top: "70%",
                                  right: "10px",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                }}
                              >
                                {showPassword ? (
                                  <IoEyeOutline />
                                ) : (
                                  <IoEyeOffOutline />
                                )}
                              </span>
                            </Form.Group>

                            <Form.Group className="mb-3 position-relative">
                              <Form.Label>Konfirmasi Password</Form.Label>
                              <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                              />

                              <span
                                onClick={toggleConfirmPassword}
                                style={{
                                  position: "absolute",
                                  top: "70%",
                                  right: "10px",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                }}
                              >
                                {showConfirmPassword ? (
                                  <IoEyeOutline />
                                ) : (
                                  <IoEyeOffOutline />
                                )}
                              </span>
                            </Form.Group>

                            <Button type="submit" disabled={isPending}>
                              {isPending ? "Loading..." : "Simpan"}
                            </Button>
                          </Form>
                        </Modal.Body>
                      </Modal>

                      <Modal
                        show={showConfirmModal}
                        onHide={() => setShowConfirmModal(false)}
                        centered
                        size="sm"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Konfirmasi</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="text-center">
                          Apakah Anda yakin ingin mengubah password?
                        </Modal.Body>

                        <Modal.Footer className="justify-content-center">
                          <Button
                            variant="secondary"
                            onClick={() => setShowConfirmModal(false)}
                            size="m"
                          >
                            Batal
                          </Button>

                          <Button
                            variant="danger"
                            onClick={handleConfirmChangePassword}
                            disabled={isPending}
                            size="m"
                            className="ms-2"
                          >
                            {isPending ? "Loading..." : "Ubah"}
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="rounded-3 text-center text-white fw-bold fs-5"
                    style={{
                      width: "8rem",
                      borderColor: "#db411f",
                      borderStyle: "solid",
                      borderWidth: "3px",
                      backgroundColor: "#EC492E",
                    }}
                  >
                    Login
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ))}
    </>
  );
};

export default NavigationBar;
