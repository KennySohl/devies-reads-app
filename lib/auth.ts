import { apiClient } from "./api";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types";

const TOKEN_KEY = "devies_reads_token";
const USER_ID_KEY = "devies_reads_user_id";

// Login user
// POST /auth/login
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );

  // Store token and userId in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(USER_ID_KEY, response.userId);
  }

  return response;
}

// POST /auth/register
export async function register(
  userData: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    userData
  );

  // Store token and userId in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(USER_ID_KEY, response.userId);
  }

  return response;
}

// GET /auth/is-logged-in
export async function isLoggedIn(): Promise<boolean> {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    await apiClient.get("/is-logged-in", { token });
    return true;
  } catch (error) {
    clearAuth();
    return false;
  }
}

// Logout user
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
}

// Get stored token
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

// Get stored user ID
export function getUserId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(USER_ID_KEY);
  }
  return null;
}

// Clear stored authentication data
function clearAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
}
