// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { checkAuthState, isAdmin } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    let settled = false;
    const fallbackTimer = setTimeout(() => {
      if (!settled) {
        setLoading(false);
      }
    }, 4500);

    const unsubscribe = checkAuthState((user) => {
      settled = true;
      clearTimeout(fallbackTimer);
      setCurrentUser(user);
      setIsAdminUser(isAdmin(user));
      setLoading(false);
    });

    return () => {
      settled = true;
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    isAdminUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
