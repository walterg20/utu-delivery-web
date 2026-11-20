const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API error');
  }

  return res.json();
}

export const auth = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, role: string) =>
    apiFetch<{ accessToken: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),
  profile: () => apiFetch<any>('/auth/profile'),
};

export const merchants = {
  get: () => apiFetch<any>('/merchants/me'),
  update: (data: any) =>
    apiFetch<any>('/merchants/me', { method: 'PUT', body: JSON.stringify(data) }),
};

export const categories = {
  list: () => apiFetch<any[]>('/categories'),
  create: (data: any) =>
    apiFetch<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiFetch<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<any>(`/categories/${id}`, { method: 'DELETE' }),
};

export const products = {
  list: (categoryId?: string) =>
    apiFetch<any[]>(`/products${categoryId ? `?categoryId=${categoryId}` : ''}`),
  create: (data: any) =>
    apiFetch<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiFetch<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<any>(`/products/${id}`, { method: 'DELETE' }),
  toggle: (id: string) =>
    apiFetch<any>(`/products/${id}/toggle`, { method: 'PATCH' }),
};

export const orders = {
  list: () => apiFetch<any[]>('/orders'),
  get: (id: string) => apiFetch<any>(`/orders/${id}`),
  create: (data: any) =>
    apiFetch<any>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string, riderId?: string) =>
    apiFetch<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, riderId }),
    }),
};

export const wallets = {
  me: () => apiFetch<any>('/wallets/me'),
  transactions: () => apiFetch<any[]>('/wallets/me/transactions'),
  topup: (amount: number) =>
    apiFetch<any>('/wallets/me/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

export const payments = {
  createPreference: (orderId: string) =>
    apiFetch<any>('/payments/preference', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
  get: (orderId: string) => apiFetch<any>(`/payments/${orderId}`),
};
