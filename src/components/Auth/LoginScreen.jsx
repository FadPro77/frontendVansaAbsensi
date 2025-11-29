import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/slices/auth";
import { login } from "../../service/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Container, Row, Col } from "react-bootstrap";
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
      className="flex justify-center items-center h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <Row className="justify-content-center relative">
          <Col
            md={6}
            lg={4}
            className="rounded-2xl shadow-xl p-6 relative z-10"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(26, 33, 41, 0.49)",
              borderRadius: "0.5rem",
            }}
          >
            {/* Title */}
            <div className="text-center mt-3">
              <h2 className="font-bold text-white">Selamat Datang</h2>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="z-10 p-2 mt-4">
              <div className="mb-4 text-white">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white  outline-none"
                />
              </div>

              <div className="mb-4 text-white">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white outline-none"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-full py-2 mt-3 mb-4 rounded-full bg-dark text-white"
                >
                  Login
                </button>
              </div>
            </form>
          </Col>

          {/* Decorative Element (jika ingin tetap dipakai) */}
          <div className="position-absolute top-50 start-100 translate-middle z-n1">
            <img src="img/car.png" alt="Decoration" className="img-fluid" />
          </div>
        </Row>
      </Container>
    </section>
  );
}

export default LoginScreen;
