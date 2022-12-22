import api from "services/api";

export async function getUsers(token: string): Promise<any[]> {
	const result = await api.get('/users', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return result.data;
}

export async function updateUser(token: string, user: any): Promise<any[]> {
	const { id, ...updatedUser } = user;
	const result = await api.put(`/users/${id}`, updatedUser, {
		headers: {
			Authorization: `Bearer ${token}`
		},
	});
	return result.data;
}