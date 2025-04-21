import EditContraceptionModal from "@/components/EditContraceptionModal";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function ContraceptionMethod() {
  const navigation = useNavigation();
  const [editContraceptionModalVisible, setEditContraceptionModalVisible] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({ title: "Méthode de contraception"});
  }, [navigation]);

  return (
    <>
      <TouchableOpacity onPress={() => setEditContraceptionModalVisible(true)}>
        <Text>Modifier la méthode de contraception</Text>
      </TouchableOpacity>

      <EditContraceptionModal
        visible={editContraceptionModalVisible}
        additionalActionTrue={() => setEditContraceptionModalVisible(false)}
      />
    </>
  )
}