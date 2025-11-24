let accessToken: string | null = null;
let expiresAt: number | null = null; // timestamp

export function getToken() {
  if (!accessToken || !expiresAt) return null;
  const now = Date.now();
  if (now > expiresAt) return null; // expired
  return accessToken;
}

export function saveToken(token: string, expiresIn: number) {
  accessToken = token;
  expiresAt = Date.now() + expiresIn * 1000; // 초 단위 → ms
}
