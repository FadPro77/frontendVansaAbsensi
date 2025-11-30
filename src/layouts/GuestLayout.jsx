/* eslint-disable react/prop-types */

import NavigationBar from "../components/Navbar";

export default function GuestLayout({ children }) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
