import { apiClient } from "@/src/core/api/client"; 
import { AuthUser, LoginResponse } from "./types";

export async function loginRequest(params: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await apiClient.post("/auth/login", params);
  return response.data;
}

export async function getMeRequest(): Promise<AuthUser> {
  const response = await apiClient.get("/auth/me");
  return response.data;
}