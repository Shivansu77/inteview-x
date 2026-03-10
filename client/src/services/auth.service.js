const TOKEN_KEY = "interviewace_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function register({ name, email, password }) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Registration failed");
  setToken(body.token);
  return { user: body.data, token: body.token };
}

async function login({ email, password }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Login failed");
  setToken(body.token);
  return { user: body.data, token: body.token };
}

async function getMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    removeToken();
    return null;
  }
  const body = await res.json();
  return body.data;
}

function logout() {
  removeToken();
}

export const authService = { register, login, getMe, logout, getToken };
