import { useState } from "react";
import api from "@/services/api";
import { useVendorAuth } from "@/context/VendorAuthContext";
import { router } from "expo-router";

type LoginPayload = {
  email: string;
  password: string;
};

export const useVendorLogin = () => {
  const { login } = useVendorAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginVendor = async ({
    email,
    password,
  }: LoginPayload) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/vendor/login", {
        email,
        password,
      });

      const { token, vendor } = res.data;

      await login(token, vendor);
      router.replace("/home")

      return { success: true };
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Vendor login failed"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loginVendor,
    loading,
    error,
  };
};
