export const getEmployees = async ({ nip, nama, jabatan, status } = {}) => {
  const token = localStorage.getItem("token");

  let params = {};

  if (nip) params.nip = nip;
  if (nama) params.nama = nama;
  if (jabatan) params.jabatan = jabatan;
  if (status) params.status = status;

  const url =
    `${import.meta.env.VITE_API_URL}/employees?` + new URLSearchParams(params);

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return result;
  console.log(result);
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

export const createEmployee = async (request) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("nip", request.nip);
  formData.append("nama", request.nama);
  formData.append("jabatan", request.jabatan);
  formData.append("status", request.status);
  formData.append("tanggal_masuk", request.tanggal_masuk);

  if (request.foto) {
    formData.append("foto", request.foto);
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};
