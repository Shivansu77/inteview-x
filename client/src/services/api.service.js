const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const saveInterviewToDb = async (interviewData) => {
  const res = await fetch(`${API_URL}/interviews`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(interviewData),
  });
  if (!res.ok) throw new Error("Failed to save interview");
  return res.json();
};

export const getInterviewsFromDb = async () => {
  const res = await fetch(`${API_URL}/interviews`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch interviews");
  const json = await res.json();
  return json.data || [];
};

export const deleteInterviewFromDb = async (id) => {
  const res = await fetch(`${API_URL}/interviews/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete interview");
  return res.json();
};

export const clearInterviewsFromDb = async () => {
  const res = await fetch(`${API_URL}/interviews`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to clear interviews");
  return res.json();
};

export const getProfileFromDb = async () => {
  const res = await fetch(`${API_URL}/profiles`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  return json.data || {};
};

export const updateProfileInDb = async (profileData) => {
  const res = await fetch(`${API_URL}/profiles`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  const json = await res.json();
  return json.data;
};
