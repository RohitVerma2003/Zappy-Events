import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Event } from "./useGetUserEvents";

export const useCreateEvent = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (vendorId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post(
        "/user/event",
        { vendorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        event: res.data.event as Event,
      };
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create event");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    loading,
    error,
  };
};
