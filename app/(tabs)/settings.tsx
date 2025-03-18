import EditContraceptionModal from "@/components/EditContraceptionModal";
import EditStartDateModal from "@/components/EditStartDateModal";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  const [editContraceptionModalVisible, setEditContraceptionModalVisible] = useState<boolean>(false);
  const [editStartDateModalVisible, setEditStartDateModalVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setEditContraceptionModalVisible(true)}>
        <Text>Modifier la méthode de contraception</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setEditStartDateModalVisible(true)}>
        <Text>Modifier la date de début de contraception</Text>
      </TouchableOpacity>

      <EditContraceptionModal
        visible={editContraceptionModalVisible}
        additionalActionTrue={() => setEditContraceptionModalVisible(false)}
      />

      <EditStartDateModal
        visible={editStartDateModalVisible}
        additionalActionTrue={() => setEditStartDateModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});