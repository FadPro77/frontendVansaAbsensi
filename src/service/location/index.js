export const getLocation = async () => {
  const token = localStorage.getItem("token");
  let params = {};

  let url =
    `${import.meta.env.VITE_API_URL}/location?` + new URLSearchParams(params);

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
