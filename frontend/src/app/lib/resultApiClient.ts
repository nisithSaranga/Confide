import axios from "axios";

const API_URL = "http://localhost:8000";

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response) {
    return err.response.data?.detail || fallback;
  }
  return fallback;
}

export const ResultApiClient = {
  saveResult: (token: string, condition: string, confidence: number) =>
    axios.post(
      `${API_URL}/results/save`,
      { condition, confidence },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  getHistory: (token: string) =>
    axios.get(`${API_URL}/results/history`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};