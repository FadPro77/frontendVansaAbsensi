export const getAbsent = async (
  pegawaiId,
  tanggal,
  jam_masuk,
  jam_keluar,
  status,
  keterangan
) => {
  const token = localStorage.getItem("token");
  let params = {};
  if (pegawaiId) {
    params.pegawaiId = pegawaiId;
  }
  if (tanggal) {
    params.tanggal = tanggal;
  }
  if (jam_masuk) {
    params.jam_masuk = jam_masuk;
  }
  if (jam_keluar) {
    params.jam_keluar = jam_keluar;
  }
  if (status) {
    params.status = status;
  }
  if (keterangan) {
    params.keterangan = keterangan;
  }
  let url =
    `${import.meta.env.VITE_API_URL}/absent?` + new URLSearchParams(params);

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

export const createAbsent = async (request) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/absent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      pegawaiId: request.pegawaiId,
      tanggal: request.tanggal,
      jam_masuk: request.jam_masuk,
      status: request.status,
      keterangan: request.keterangan,
    }),
  });

  const result = await response.json();
  return result;
};

export const updateAbsent = async (id, payload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/absent/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
};

export const getAbsentById = async (id) => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/absent/${id}`;

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
