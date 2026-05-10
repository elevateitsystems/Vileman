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

export async function fetchAdmins(token: string, params: { search?: string, page?: number, limit?: number } = {}) {
  const { search, page = 1, limit = 10 } = params;
  const searchParams = new URLSearchParams({
    role: 'admin',
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    searchParams.set('search', search);
  }

  const url = `${BACKEND_URL}/users?${searchParams.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch admins");
  return json; // Return the whole response for pagination metadata
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


export async function changePassword(token: string, currentPassword: string, newPassword: string, confirmNewPassword: string) {
  const url = `${BACKEND_URL}/auth/change-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to change password");
  return json;
}

// Category Operations
export async function fetchCategories() {
  const url = `${BACKEND_URL}/categories`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch categories");
  return json.data;
}

export async function fetchCategoryById(id: string) {
  const url = `${BACKEND_URL}/categories/${id}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch category");
  return json.data;
}

export async function createCategory(token: string, data: { name: string; description: string }) {
  const url = `${BACKEND_URL}/categories`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create category");
  return json.data;
}

export async function updateCategory(token: string, id: string, data: Partial<{ name: string; description: string }>) {
  const url = `${BACKEND_URL}/categories/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update category");
  return json.data;
}

export async function deleteCategory(token: string, id: string) {
  const url = `${BACKEND_URL}/categories/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isDeleted: true }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete category");
  return json.data;
}

export async function deleteSubCategory(token: string, id: string) {
  const url = `${BACKEND_URL}/sub-categories/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isDeleted: true }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete sub-category");
  return json.data;
}

// Sub-Category Operations
export async function fetchSubCategories() {
  const url = `${BACKEND_URL}/sub-categories`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch sub-categories");
  return json.data;
}

export async function createSubCategory(token: string, data: { name: string; description: string; categoryId: string }) {
  const url = `${BACKEND_URL}/sub-categories`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create sub-category");
  return json.data;
}

// Product Operations
export async function fetchProducts() {
  const url = `${BACKEND_URL}/products`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch products");
  return json.data;
}

export async function fetchProductBySlug(slug: string) {
  const url = `${BACKEND_URL}/products/${slug}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch product");
  return json.data;
}

export async function createProduct(token: string, data: any) {
  const url = `${BACKEND_URL}/products`;
  
  const isFormData = data instanceof FormData;
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? data : JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create product");
  return json.data;
}

export async function updateProduct(token: string, id: string, data: any) {
  const url = `${BACKEND_URL}/products/${id}`;
  
  const isFormData = data instanceof FormData;
  
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? data : JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update product");
  return json.data;
}

export async function deleteProduct(token: string, id: string) {
  const url = `${BACKEND_URL}/products/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete product");
  return json.data;
}

// Order Operations
export async function createCheckoutSession(data: {
  customerEmail: string;
  customerPhone: string;
  shippingCountry: string;
  products: { productId: string; quantity: number }[];
}) {
  const url = `${BACKEND_URL}/order/checkout`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create checkout session");
  return json.data;
}
