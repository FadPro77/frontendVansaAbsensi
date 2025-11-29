import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "@tanstack/react-router";
import logoNav from "../../assets/img/logoNoBg.png";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../../redux/slices/auth";
import { profile } from "../../service/auth";
import { useQuery } from "@tanstack/react-query";
import "./Navbar.css";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

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
                  to="/"
                  style={{ cursor: "pointer" }}
                  className="fw-bold text-white me-5"
                >
                  Cuti
                </Nav.Link>
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
