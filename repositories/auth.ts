import api from "services/api";

export async function login(email: string, password: string) {
  const result = await api.post('/auth/login', {
    email,
    password
  });
  return result.data;
}

export async function recovery(email: string) {
  await api.post('/auth/recovery', {
    email
  });
  return true;
}

export async function recoveryByToken(token: string, password: string) {
  await api.post(`/auth/recovery/${token}`, {
    password
  });
  return true;
}