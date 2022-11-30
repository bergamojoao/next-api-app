import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (token && id) {
        const response = await api.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
	  throw(error)
    }
  }, []);

  useEffect(() => {
    (async () => {
	  if(!user){
		await fetchUser();
	  }
      setIsLoading(false);
    })();
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  const userContextValue = {
    user,
    isLoading,
    fetchUser,
	logout,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {" "}
      {children}{" "}
    </UserContext.Provider>
  );
}

export default function useUser() {
  return useContext(UserContext);
}
