import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    api.get("/me")
      .then(({ data }) => { setUser(data.user); setProfile(data.profile); })
      .catch(() => { localStorage.removeItem("token"); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", data.token);
    setUser(data.user); setProfile(data.profile);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user); setProfile(data.profile);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); setProfile(null);
  };

  const refresh = async () => {
    const { data } = await api.get("/me");
    setUser(data.user); setProfile(data.profile);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
