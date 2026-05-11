import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 0,
});

export interface RunRequest {
  code: string;
}

export interface RunResponse {
  stdout: string;
  stderr: string;
  timed_out: boolean;
  exit_code: number | null;
}

export async function runCode(payload: RunRequest): Promise<RunResponse> {
  const response = await apiClient.post<RunResponse>("/api/run/", payload);
  return response.data;
}
