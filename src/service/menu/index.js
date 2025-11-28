export const getMenu = async (nama, harga, kategori) => {
  const token = localStorage.getItem("token");
  let params = {};
  if (nama) {
    params.nama = nama;
  }
  if (harga) {
    params.harga = harga;
  }
  if (kategori) {
    params.kategori = kategori;
  }
  let url =
    `${import.meta.env.VITE_API_URL}/menu?` + new URLSearchParams(params);

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  // get data
  const result = await response.json();
  return result?.data;
};
