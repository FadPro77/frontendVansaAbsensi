export const login = async (request) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    body: JSON.stringify(request),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  if (!result?.success) {
    throw new Error(result?.message);
  }
  return result?.data;
};

export const register = async (request) => {
  const formData = new FormData();
  formData.append("password", request.password);
  formData.append("pegawaiId", request.pegawaiId);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  if (!result?.success) {
    throw new Error(result?.message);
  }
  return result?.data;
};

export const registerAdmin = async (request) => {
  const formData = new FormData();
  formData.append("password", request.password);
  formData.append("username", request.username);
  formData.append("nama_lengkap", request.nama_lengkap);

  const response = await fetch(`${API}/auth/register/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const result = await response.json();
  if (!result?.success) {
    throw new Error(result?.message);
  }
  return result?.data;
};

export const profile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  const result = await response.json();
  return result?.data;
};
