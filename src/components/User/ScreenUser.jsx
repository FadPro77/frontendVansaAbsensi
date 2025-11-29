// import { useState, useEffect } from "react";
// import { Container, Form, Button, Modal } from "react-bootstrap";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import { profile, updateUser, login } from "../../service/auth";
// import toast, { Toaster } from "react-hot-toast";

// const ScreenUser = () => {
//   const [user, setUser] = useState(null);
//   const [first_name, setFirstName] = useState("");
//   const [last_name, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [isEditable, setIsEditable] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await profile();
//         const userData = res;
//         setUser(userData);
//         setFirstName(userData?.first_name || "");
//         setLastName(userData?.last_name || "");
//         setPhone(userData?.phone || "");
//         setEmail(userData?.email || "");
//       } catch {
//         toast.error("Gagal mengambil data profil.");
//       }
//     };
//     fetchProfile();
//   }, []);

//   const toggleConfirmPasswordVisibility = () =>
//     setShowConfirmPassword(!showConfirmPassword);

//   const handleEditClick = () => setShowModal(true);

//   const handleConfirmPassword = async () => {
//     try {
//       const res = await login({ email, password: confirmPassword });
//       if (res) {
//         setIsEditable(true);
//         setShowModal(false);
//         toast.success("Password dikonfirmasi. Silakan edit profil.");
//       }
//     } catch {
//       toast.error("Password salah");
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const updateData = {
//         first_name,
//         last_name,
//         phone,
//         email,
//       };

//       await updateUser(user?.id, updateData);
//       toast.success("Profil berhasil diperbarui");
//       setIsEditable(false);
//     } catch {
//       toast.error("Gagal memperbarui profil");
//     }
//   };

//   return (
//     <section id="user-profile" style={{ paddingTop: "12rem" }}>
//       <Toaster position="top-right" reverseOrder={false} />
//       <Container style={{ width: "70%" }}>
//         <h2
//           className="text-white text-center mb-4"
//           style={{ fontSize: "75px", fontFamily: "'Caveat'" }}
//         >
//           Profil Pengguna
//         </h2>
//         <Form className="z-3 p-5">
//           <Form.Group className="mb-3 text-white">
//             <Form.Label>Nama Depan</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter first name"
//               value={first_name}
//               onChange={(e) => setFirstName(e.target.value)}
//               readOnly={!isEditable}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3 text-white">
//             <Form.Label>Nama Belakang</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter last name"
//               value={last_name}
//               onChange={(e) => setLastName(e.target.value)}
//               readOnly={!isEditable}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3 text-white">
//             <Form.Label>Nomor Telepon</Form.Label>
//             <PhoneInput
//               placeholder="Enter phone number"
//               value={phone}
//               onChange={setPhone}
//               disabled={!isEditable}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3 text-white">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               readOnly={!isEditable}
//               required
//             />
//           </Form.Group>

//           {!isEditable ? (
//             <Button variant="light" onClick={handleEditClick}>
//               Edit Profil
//             </Button>
//           ) : (
//             <Button variant="success" onClick={handleUpdate} className="mt-3">
//               Simpan Perubahan
//             </Button>
//           )}
//         </Form>
//       </Container>

//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Konfirmasi Password</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Masukkan password Anda</Form.Label>
//             <div className="position-relative">
//               <Form.Control
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//               <span
//                 onClick={toggleConfirmPasswordVisibility}
//                 style={{
//                   position: "absolute",
//                   top: "8px",
//                   right: "10px",
//                   cursor: "pointer",
//                   zIndex: 2,
//                   color: "#999",
//                 }}
//               >
//                 {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
//               </span>
//             </div>
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Batal
//           </Button>
//           <Button variant="primary" onClick={handleConfirmPassword}>
//             Konfirmasi
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </section>
//   );
// };

// export default ScreenUser;
