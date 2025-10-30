
const BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:8080";

let token: string | null = null;
export function setToken(t: string) { token = t; }

async function http(path: string, options: any = {}) {
  const headers: any = { "Content-Type": "application/json", ...(options.headers||{}) };
  if (token) headers["Authorization"] = "Bearer " + token;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error((await res.json()).error || "HTTP error");
  return res.json();
}

export const api = {
  login: (email: string, password: string) => http("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, displayName: string) => http("/auth/register", { method: "POST", body: JSON.stringify({ email, password, displayName }) }),
  activities: () => http("/activities"),
  getProfile: () => http("/profile"),
  saveProfile: (data: any) => http("/profile", { method: "POST", body: JSON.stringify(data) }),
  partners: () => http("/partners"),
  conversationCreate: (peerUserId: string) => http("/conversations", { method: "POST", body: JSON.stringify({ peerUserId }) }),
  messages: (conversationId: string) => http(`/conversations/${conversationId}/messages`)
}
