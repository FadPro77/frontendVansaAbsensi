export const getPayment = async () => {
  const token = localStorage.getItem("token");
  let params = {};

  let url =
    `${import.meta.env.VITE_API_URL}/payment?` + new URLSearchParams(params);

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  // get data
  const result = await response.json();
  console.log("📦 getPayment result:", result);
  return result?.data;
};

export const createPayment = async (request) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("pesanan_id", request.pesanan_id);
  formData.append("metode", request.metode);
  formData.append("status", request.status);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/payment`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: formData,
  });

  // get the data if fetching succeed!
  const result = await response.json();
  if (!result?.success) {
    throw new Error(result?.message);
  }
  return result?.data;
};
