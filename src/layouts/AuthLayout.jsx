/* eslint-disable react/prop-types */

import NavigationBar from "../components/Navbar";

export default function AuthLayout({ children }) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
