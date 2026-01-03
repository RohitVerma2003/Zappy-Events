import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import api from "@/services/api";
import { useVendorAuth } from "@/context/VendorAuthContext";

type Event = {
  _id: string;
  status: string;
  userId: {
    name?: string;
    email?: string;
    initials?: string;
  };
  createdAt: string;
};


export default function VendorHomeScreen() {
  const router = useRouter();
  const { token } = useVendorAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVendorEvents = async () => {
    try {
      setRefreshing(true)
      const res = await api.get("/vendor/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(res.data.events || []);
    } catch (error) {
      console.error("Failed to fetch vendor events");
    } finally {
      setLoading(false);
      setRefreshing(false)
    }
  };

  useEffect(() => {
    fetchVendorEvents();
  }, []);

  const renderEvent = ({ item }: { item: Event }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
      onPress={() => router.push(`/event/${item._id}`)}
    >
      <Text style={styles.cardTitle}>Event ID: {item._id.slice(-6)}</Text>

      <Text style={styles.cardSub}>Status: {item.status}</Text>
    </Pressable>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Assigned Events</Text>

        <TouchableOpacity onPress={fetchVendorEvents} disabled={refreshing}>
          <Ionicons
            name="refresh"
            size={24}
            color={refreshing ? "#aaa" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events assigned yet</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },

  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});
