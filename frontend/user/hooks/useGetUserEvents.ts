import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export type Event = {
  _id: string;
  status: string;
  vendorId: {
    name: string;
    companyName?: string;
    initials?: string;
  };
  createdAt: string;
};

export const useGetUserEvents = () => {
  const { token } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/user/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(res.data.events || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
};
