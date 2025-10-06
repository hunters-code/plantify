"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type UserType = "investor" | "founder" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  userType: UserType;
  signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);

  const signIn = async () => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsRegistered(true);
        setUserType("investor"); 
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, isRegistered, userType, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
