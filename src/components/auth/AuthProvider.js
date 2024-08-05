import React, { createContext, useContext, useState } from "react";
import { AUTH_URL } from "../../config/user/host-config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password, nickname) => {
    const payload = {
      email: email,
      password: password,
      nickname: nickname,
      autoLogin: true
    }

    const response = await fetch(`${AUTH_URL}/register-and-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data);
      return data;
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
