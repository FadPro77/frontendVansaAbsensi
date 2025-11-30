export const getLeaves = async (
  pegawaiId,
  tanggal_mulai,
  tanggal_selesai,
  jenis,
  status_pengajuan,
  alasan
) => {
  const token = localStorage.getItem("token");
  let params = {};
  if (pegawaiId) {
    params.pegawaiId = pegawaiId;
  }
  if (tanggal_mulai) {
    params.tanggal_mulai = tanggal_mulai;
  }
  if (tanggal_selesai) {
    params.tanggal_selesai = tanggal_selesai;
  }
  if (jenis) {
    params.jenis = jenis;
  }
  if (status_pengajuan) {
    params.status_pengajuan = status_pengajuan;
  }
  if (alasan) {
    params.alasan = alasan;
  }
  let url =
    `${import.meta.env.VITE_API_URL}/leaves?` + new URLSearchParams(params);

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

export const getLeavesById = async (id) => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/leaves/${id}`;

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

export const createLeaves = async (request) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/leaves`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      pegawaiId: request.pegawaiId,
      tanggal_mulai: request.tanggal_mulai,
      tanggal_selesai: request.tanggal_selesai,
      jenis: request.jenis,
      status_pengajuan: request.status_pengajuan,
      alasan: request.alasan,
    }),
  });

  const result = await response.json();
  return result;
};

export const updateLeaves = async (id, payload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/leaves/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
};
