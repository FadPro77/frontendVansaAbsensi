export const getPesanan = async () => {
  const token = localStorage.getItem("token");
  let params = {};

  let url =
    `${import.meta.env.VITE_API_URL}/pesanan?` + new URLSearchParams(params);

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

export const createPesanan = async (request) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/pesanan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      location_id: request.location_id,
      address: request.address,
      pesanan_items: request.pesanan_items,
    }),
  });

  const result = await response.json();
  return result;
};

export const deletePesanan = async (id) => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/pesanan/${id}`;

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });

  // get data
  const result = await response.json();
  return result?.data;
};
