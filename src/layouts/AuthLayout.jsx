/* eslint-disable react/prop-types */
import Footer from "../components/Footer";
import NavigationBar from "../components/Navbar";

export default function AuthLayout({ children }) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
