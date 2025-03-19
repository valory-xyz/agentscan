import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { env } from "next-runtime-env";
export function useAuth() {
  const { login, logout, authenticated, user, getAccessToken } = usePrivy();

  const updateUser = async () => {
    if (!authenticated) return;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    };

    await fetch(`${env("NEXT_PUBLIC_API_URL")}/auth`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId: user?.id,
      }),
    }
    );
  };

  const signIn = async () => {
    if (!authenticated) return;
    login();
    await updateUser();
  };

  useEffect(() => {
    signIn();
    //call /auth endpoint to update user
  }, [authenticated]);

  return {
    login,
    logout,
    isAuthenticated: authenticated,
    user,
    getAccessToken,
  };
}
