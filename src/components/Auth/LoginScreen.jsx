import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/slices/auth";
import { login } from "../../service/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import bgHome from "../../assets/img/div-main-container.png";
import logo from "../../assets/img/logo2.jpg";

function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { token } = useSelector((state) => state.auth);

  if (token) {
    navigate({ to: "/" });
  }

  const { mutate: loginUser } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(setToken(data?.token));
      navigate({ to: "/" });
    },
    onError: (err) => {
      toast.error(err?.message);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    loginUser({ username, password });
  };

  return (
    <section
      className="d-flex justify-content-center align-items-center vh-100 position-relative overflow-hidden"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container>
        <Row className="justify-content-center position-relative ">
          <Col
            md={6}
            lg={4}
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(26, 33, 41, 0.49)",

              borderRadius: "0.5rem",
            }}
            className=" rounded-4 shadow-lg p-4 position-relative"
          >
            <div className="text-center mt-2">
              <h2 className="fw-bold text-white">Selamat Datang</h2>
            </div>

            <Form onSubmit={onSubmit} className="z-3 p-4">
              <Form.Group className="mb-3 text-white">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 text-white">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="dark" type="submit" className="w-100 mt-3">
                Login
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

export default LoginScreen;
