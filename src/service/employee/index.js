export const getEmployees = async (nip, nama, jabatan, status) => {
  const token = localStorage.getItem("token");
  let params = {};
  if (nip) {
    params.nip = nip;
  }
  if (nama) {
    params.nama = nama;
  }
  if (jabatan) {
    params.jabatan = jabatan;
  }
  if (status) {
    params.status = status;
  }
  let url =
    `${import.meta.env.VITE_API_URL}/employees?` + new URLSearchParams(params);

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

export const getEmployeeById = async (id) => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/employees/${id}`;

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
