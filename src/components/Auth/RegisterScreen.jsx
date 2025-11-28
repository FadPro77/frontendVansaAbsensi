import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/slices/auth";
import { register } from "../../service/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import bgHome from "../../assets/img/div-main-container.png";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function RegisterScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<IoEyeOffOutline />);
  const [confirmType, setConfirmType] = useState("password");
  const [confirmIcon, setConfirmIcon] = useState(<IoEyeOffOutline />);
  const { token } = useSelector((state) => state.auth);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  if (token) {
    navigate({ to: "/" });
  }

  const { mutate: registerUser } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      dispatch(setToken(data?.token));
      navigate({ to: "/" });
    },
    onError: (err) => {
      toast.error(err?.message);
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    if (!first_name) {
      setErrors((prev) => ({ ...prev, first_name: "First Name is required" }));
      firstNameRef.current?.focus();
      return;
    }
    if (!last_name) {
      setErrors((prev) => ({ ...prev, last_name: "Last Name is required" }));
      lastNameRef.current?.focus();
      return;
    }
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      emailRef.current?.focus();
      return;
    }
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: "Phone Number is required" }));
      phoneRef.current?.focus();
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      passwordRef.current?.focus();
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Password is not same!",
      }));
      confirmPasswordRef.current?.focus();
      return;
    }

    const request = {
      first_name,
      last_name,
      phone,
      email: email.trim(),
      password,
    };
    registerUser(request);
  };

  const handleEyeToggle = (field) => {
    if (field === "password") {
      if (type === "password") {
        setType("text");
        setIcon(<IoEyeOutline />);
      } else {
        setType("password");
        setIcon(<IoEyeOffOutline />);
      }
    } else if (field === "confirmPassword") {
      if (confirmType === "password") {
        setConfirmType("text");
        setConfirmIcon(<IoEyeOutline />);
      } else {
        setConfirmType("password");
        setConfirmIcon(<IoEyeOffOutline />);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    registerUser({ first_name, last_name, phone, email, password });
  };

  return (
    <section
      className="d-flex justify-content-center align-items-center vh-100 position-relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container>
        <Row className="justify-content-center position-relative">
          <Col
            md={6}
            lg={4}
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(26, 33, 41, 0.7)",

              borderRadius: "0.5rem",
            }}
            className=" rounded-4 shadow-lg p-4 position-relative"
          >
            <Button variant="" as={Link} to="/" className="position-absolute">
              <i className="bi bi-arrow-left fw-bold text-white fs-3"></i>
            </Button>

            <div className="text-center mt-4">
              <h2 className="fw-bold text-white">Daftar</h2>
            </div>

            <Form onSubmit={onSubmit} className="z-3 p-5">
              <Form.Group className="mb-3 text-white">
                <Form.Label>Nama Depan</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Nama Belakang</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Nomor Telepon</Form.Label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 text-white position-relative">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={type}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => handleEyeToggle("password")}
                  style={{
                    position: "absolute",
                    top: "38px",
                    right: "10px",
                    cursor: "pointer",
                    zIndex: 2,
                    color: "#999",
                  }}
                >
                  {icon}
                </span>
              </Form.Group>

              <Form.Group className="mb-3 text-white position-relative">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type={confirmType}
                  placeholder="Enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => handleEyeToggle("confirmPassword")}
                  style={{
                    position: "absolute",
                    top: "38px",
                    right: "10px",
                    cursor: "pointer",
                    zIndex: 2,
                    color: "#999",
                  }}
                >
                  {confirmIcon}
                </span>
              </Form.Group>

              <Button variant="dark" type="submit" className="w-100 mt-3">
                Register
              </Button>
            </Form>
          </Col>

          <div className="decoration position-absolute top-50 z-n1 start-100 translate-middle">
            <img src="img/car.png" alt="Decoration" className="img-fluid" />
          </div>
        </Row>
      </Container>
    </section>
  );
}

export default RegisterScreen;
