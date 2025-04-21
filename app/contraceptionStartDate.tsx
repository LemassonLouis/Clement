import EditStartDateModal from "@/components/EditStartDateModal";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function ContraceptionStartDate() {
  const navigation = useNavigation();
  const [editStartDateModalVisible, setEditStartDateModalVisible] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({ title: "Date de début de contraception"});
  }, [navigation]);

  return (
    <>
      <TouchableOpacity onPress={() => setEditStartDateModalVisible(true)}>
        <Text>Modifier la date de début de contraception</Text>
      </TouchableOpacity>

      <EditStartDateModal
        visible={editStartDateModalVisible}
        additionalActionTrue={() => setEditStartDateModalVisible(false)}
      />
    </>
  )
}