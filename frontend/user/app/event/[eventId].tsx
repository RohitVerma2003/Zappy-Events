import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

type Event = {
  _id: string;
  status: string;
  vendorId: {
    name: string;
    companyName?: string;
    initials?: string;
  };
  arrival?: {
    image: string;
    location: {
      lat: number;
      lon: number;
    };
    arrivedAt: string;
  };
  setup?: {
    pre?: {
      image: string;
      note?: string;
    };
    post?: {
      image: string;
      note?: string;
    };
  };
  createdAt: string;
};

export default function EventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { token } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  const fetchEvent = async () => {
    try {
      setRefreshing(true);

      const res = await api.get(`/user/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvent(res.data.event);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch event details");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const sendArrivalOtp = async () => {
    try {
      setSendingOTP(true);
      await api.post(
        "/user/otp/arrival/send",
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", "Arrival OTP sent to your email");
    } catch {
      Alert.alert("Error", "Failed to send arrival OTP");
    } finally {
      setSendingOTP(false);
    }
  };

  const sendCompletionOtp = async () => {
    try {
      setSendingOTP(true);
      await api.post(
        "/user/otp/completion/send",
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", "Completion OTP sent to your email");
    } catch {
      Alert.alert("Error", "Failed to send completion OTP");
    } finally {
      setSendingOTP(false);
    }
  };

  if (loading || refreshing) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!event) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {event.vendorId.companyName || event.vendorId.name}
            </Text>
            <Text style={styles.status}>Status: {event.status}</Text>
          </View>

          <TouchableOpacity onPress={fetchEvent} disabled={refreshing}>
            <Ionicons
              name="refresh"
              size={24}
              color={refreshing ? "#aaa" : "#000"}
            />
          </TouchableOpacity>
        </View>

        {event.arrival && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vendor Arrival</Text>
            <Image
              source={{ uri: "http://192.168.1.17:8000" + event.arrival.image }}
              style={styles.image}
            />
            <Text style={styles.meta}>
              Location: {event.arrival.location.lat},{" "}
              {event.arrival.location.lon}
            </Text>
          </View>
        )}

        {event.setup?.pre && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pre Setup</Text>
            <Image
              source={{
                uri: "http://192.168.1.17:8000" + event.setup.pre.image,
              }}
              style={styles.image}
            />
            {event.setup.pre.note && <Text>{event.setup.pre.note}</Text>}
          </View>
        )}

        {event.setup?.post && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Post Setup</Text>
            <Image
              source={{
                uri: "http://192.168.1.17:8000" + event.setup.post.image,
              }}
              style={styles.image}
            />
            {event.setup.post.note && <Text>{event.setup.post.note}</Text>}
          </View>
        )}

        {event.status === "VENDOR_ARRIVED" && (
          <TouchableOpacity
            style={styles.button}
            onPress={sendArrivalOtp}
            disabled={sendingOTP}
          >
            {sendingOTP ? (
              <Text style={styles.buttonText}>Generating Arrival OTP</Text>
            ) : (
              <Text style={styles.buttonText}>Generate Arrival OTP</Text>
            )}
          </TouchableOpacity>
        )}

        {event.status === "SETUP_COMPLETED" && (
          <TouchableOpacity
            style={styles.button}
            onPress={sendCompletionOtp}
            disabled={sendingOTP}
          >
            {sendingOTP ? (
              <Text style={styles.buttonText}>Generating Completion OTP</Text>
            ) : (
              <Text style={styles.buttonText}>Generate Completion OTP</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  status: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: "#666",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
