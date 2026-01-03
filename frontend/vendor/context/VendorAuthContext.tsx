import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type Vendor = {
  id: string;
  name: string;
  email: string;
};

type VendorAuthContextType = {
  vendor: Vendor | null;
  token: string | null;
  loading: boolean;
  login: (token: string, vendor: Vendor) => Promise<void>;
  logout: () => Promise<void>;
};

const VendorAuthContext = createContext<
  VendorAuthContextType | undefined
>(undefined);

export const VendorAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("vendor_token");
      const storedVendor = await AsyncStorage.getItem("vendor");

      if (storedToken && storedVendor) {
        setToken(storedToken);
        setVendor(JSON.parse(storedVendor));
        router.replace("/home")
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (token: string, vendor: Vendor) => {
    await AsyncStorage.setItem("vendor_token", token);
    await AsyncStorage.setItem("vendor", JSON.stringify(vendor));
    setToken(token);
    setVendor(vendor);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("vendor_token");
    await AsyncStorage.removeItem("vendor");
    setToken(null);
    setVendor(null);
  };

  return (
    <VendorAuthContext.Provider
      value={{ vendor, token, loading, login, logout }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) {
    throw new Error(
      "useVendorAuth must be used within VendorAuthProvider"
    );
  }
  return ctx;
};
