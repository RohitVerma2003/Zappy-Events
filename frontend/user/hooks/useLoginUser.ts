import { useState } from "react";
import api from "@/services/api";
import { useAuth } from "../context/AuthContext";

type LoginPayload = {
  email: string;
  password: string;
};

export const useLoginUser = () => {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async ({ email, password }: LoginPayload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/user/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      
      await login(token, user);

      return { success: true };
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Login failed. Please try again.";
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    loading,
    error,
  };
};
