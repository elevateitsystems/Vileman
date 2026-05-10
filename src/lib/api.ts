import Cookies from 'js-cookie';

const BACKEND_URL =
  typeof window !== "undefined"
    ? "/api/proxy"
    : process.env.BACKEND_URL ||
      "https://vileman-backend.onrender.com/api";

export async function login(credentials: any) {
  const url = `${BACKEND_URL}/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");
  return json;
}

export async function register(userData: any) {
  const url = `${BACKEND_URL}/auth/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: userData instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: userData instanceof FormData ? userData : JSON.stringify(userData),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed");
  return json;
}

export async function getProfile(token: string) {
  const url = `${BACKEND_URL}/auth/profile`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch profile");
  return json.data;
}

export async function logout(token: string) {
  const url = `${BACKEND_URL}/auth/logout`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || "Logout failed");
  }
  return true;
}

// User CRUD operations
export async function fetchUsers(token: string) {
  const url = `${BACKEND_URL}/users`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch users");
  return json.data;
}

export async function updateUser(token: string, userId: string, userData: any) {
  const url = `${BACKEND_URL}/users/${userId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Update failed");
  return json.data;
}

export async function deleteUser(token: string, userId: string) {
  const url = `${BACKEND_URL}/users/${userId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || "Delete failed");
  }
  return true;
}

// Password Reset Flow
export async function forgotPassword(email: string) {
  const url = `${BACKEND_URL}/auth/forgot-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to send reset code");
  return json;
}

export async function verifyOtp(email: string, code: string) {
  const url = `${BACKEND_URL}/auth/verify-reset-password-otp`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Invalid OTP code");
  return json;
}

export async function resetPassword(email: string, newPassword: string) {
  const url = `${BACKEND_URL}/auth/reset-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to reset password");
  return json;
}
