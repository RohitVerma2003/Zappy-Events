import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useGetUserEvents } from "@/hooks/useGetUserEvents";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { events, loading, refetch } = useGetUserEvents();
  const { createEvent, loading: creating } = useCreateEvent();

  const handleCreateEvent = async () => {
    if (!vendorId.trim()) return;

    const res = await createEvent(vendorId);

    if (res.success) {
      setVendorId("");
      setModalVisible(false);
      refetch();
    }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
      onPress={() => router.push(`/event/${item._id}`)}
    >
      <Text style={styles.cardTitle}>
        {item.vendorId?.companyName || item.vendorId?.name}
      </Text>
      <Text style={styles.cardStatus}>Status: {item.status}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Events</Text>

        <TouchableOpacity onPress={refetch} disabled={refreshing}>
          <Ionicons
            name="refresh"
            size={24}
            color={refreshing ? "#aaa" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events created yet</Text>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createBtnText}>Create Event</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={events}
            keyExtractor={(item) => item._id}
            renderItem={renderEvent}
            contentContainerStyle={{ paddingBottom: 80 }}
          />

          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.fabText}>＋</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Event</Text>

            <TextInput
              placeholder="Vendor ID"
              value={vendorId}
              onChangeText={setVendorId}
              style={styles.input}
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleCreateEvent}
                disabled={creating}
              >
                <Text style={{ color: "#fff" }}>
                  {creating ? "Creating..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  createBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "600",
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
  cardStatus: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  confirmBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
