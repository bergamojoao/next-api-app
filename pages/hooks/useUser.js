

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from 'services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = useCallback(async () => {
		try {
			const token = localStorage.getItem('token');
			const id = localStorage.getItem('id');
			if (token && id) {
				const response = await api.get(`/users/${id}`, {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				});
				localStorage.setItem('user', JSON.stringify(response.data));
				setUser(response.data)
			}
		} catch (error) {
			console.log('aqui2', error)
			setUser(null);
		}
	}, []);

	useEffect(() => {
		(async () => {
			await fetchUser();
			setIsLoading(false);
		})();
	}, [fetchUser]);

	const userContextValue = {
		user,
		isLoading,
		fetchUser,
	};

	return <UserContext.Provider value={userContextValue}> {children} </UserContext.Provider>;
}

export default function useUser() {
	return useContext(UserContext);
}