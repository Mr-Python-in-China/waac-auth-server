"use client";

import assertLogin from "@/utils/assertLogin";
import { createContext, useContext } from "react";

const authContext = createContext<
  { uid: string; username: string } | undefined
>(undefined);

export function AuthContextProvider({
  user,
  children,
}: {
  user: { uid: string; username: string } | undefined;
  children?: React.ReactNode;
}) {
  return <authContext.Provider value={user}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

export const useAuthLogined = () => {
  const x = useAuth();
  assertLogin(x);
  return x;
};
