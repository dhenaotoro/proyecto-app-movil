import React, { createContext, PropsWithChildren, useState } from 'react';

type AuthProps = PropsWithChildren<{}>;

const isAuthenticated: boolean = false;
const login: Function = () => {};
const logout: Function = () => {};

export const AuthContext = createContext({ isAuthenticated, login, logout });

export const AuthProvider = ({ children }: AuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};