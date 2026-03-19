const TOKEN_KEY = "interviewace_token";

async function parseResponseBody(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function getErrorMessage(res, body, fallback) {
  if (body && typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }

  if (res.statusText) {
    return `${fallback} (${res.status}: ${res.statusText})`;
  }

  return fallback;
}

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
  const body = await parseResponseBody(res);
  if (!res.ok) throw new Error(getErrorMessage(res, body, "Registration failed"));
  if (!body?.token || !body?.data) throw new Error("Registration failed (invalid server response)");
  setToken(body.token);
  return { user: body.data, token: body.token };
}

async function login({ email, password }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await parseResponseBody(res);
  if (!res.ok) throw new Error(getErrorMessage(res, body, "Login failed"));
  if (!body?.token || !body?.data) throw new Error("Login failed (invalid server response)");
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
  const body = await parseResponseBody(res);
  if (!body || !body.data) return null;
  return body.data;
}

function logout() {
  removeToken();
}

export const authService = { register, login, getMe, logout, getToken };
