import axios from "./axios"

const API_BASE = "/api/auth"

function setToken(token: string) {
  localStorage.setItem("jwt_token", token)
}

function getToken(): string | null {
  return localStorage.getItem("jwt_token")
}

function clearToken() {
  localStorage.removeItem("jwt_token")
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  const res = await axios.post(`${API_BASE}/login`, { email, password })
  const { token } = res.data
  setToken(token)
  return { token }
}

export async function register(name: string, email: string, password: string): Promise<{ token: string }> {
  const res = await axios.post(`${API_BASE}/register`, { name, email, password })
  const { token } = res.data
  setToken(token)
  return { token }
}

export async function logout(): Promise<void> {
  await axios.post(`${API_BASE}/logout`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  clearToken()
}

export function getAuthHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
