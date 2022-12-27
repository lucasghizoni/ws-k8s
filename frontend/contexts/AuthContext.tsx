import {createContext, PropsWithChildren, useState} from 'react';
import { destroyCookie, setCookie } from 'nookies';
import Router from "next/router";

import { api, getAPIClient } from "../services/axios";

interface UserLoginFormData {
  name: string;
  password: string;
}

interface AuthContextType {
  userData: { name: string, id: string } | null;
  getUserData: () => void;
  signIn: (userData: UserLoginFormData) => void;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: PropsWithChildren) {
  const [userData, setUserData] = useState<AuthContextType['userData']>(null);

  async function getUserData() {
    const { data } = await getAPIClient()
      .get<AuthContextType['userData']>('/user/info');

    setUserData(data);
  }

  async function signIn(userData: UserLoginFormData) {
    const { data: { token, id } } = await getAPIClient()
      .post<{token: string, id: string}>('/users/login', userData);

    setUserData({ id, name: userData.name });

    setCookie(undefined, 'wsk8s.token', token, {
      maxAge: 60 * 60 * 200000000, // infinite expiration date
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    Router.push('/');
  }

  function signOut() {
    destroyCookie(undefined, 'wsk8s.token');
    Router.push('/signin');
  }

  return (
    <AuthContext.Provider value={{ userData, signIn, signOut, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
}