import axios from "axios";

const API_URL = "http://localhost:8000";

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response) {
    return err.response.data?.detail || fallback;
  }
  return fallback;
}

export const AuthApiClient = {
  login: (email: string, password: string) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),

  register: (email: string, password: string) =>
    axios.post(`${API_URL}/auth/register`, { email, password }),

  requestPasswordReset: (email: string) =>
    axios.post(`${API_URL}/auth/forgot-password`, { email }),

  resetPassword: (token: string, newPassword: string) =>
    axios.post(`${API_URL}/auth/reset-password`, { token, new_password: newPassword }),

  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    axios.post(
      `${API_URL}/auth/change-password`,
      { current_password: currentPassword, new_password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  verify: (token: string) =>
    axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};