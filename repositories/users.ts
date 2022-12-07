import api from "services/api";

export async function getUsers(token: string): Promise<any[]> {
    const result = await api.get('/users',{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return result.data;
  }