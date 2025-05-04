import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import CustomModal from "./CustomModal";
import { getAllContraceptionMethods } from "@/services/contraception";
import { useContext, useState } from "react";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { ContraceptionMethodInterface } from "@/interfaces/ContraceptionMethod";
import { Feather } from "@expo/vector-icons";
import { updateUser } from "@/database/user";
import { UserContext } from "@/context/UserContext";
import { User } from "@/types/UserType";

export default function EditContraceptionModal({ visible, additionalActionTrue }: {visible: boolean, additionalActionTrue: () => void}) {
  const { user, setUser } = useContext(UserContext);

  const [selectedContraception, setSelectedContraception] = useState<ContraceptionMethods>(user.method);

  const chooseContraceptionMethod = (item: any) => {
    setSelectedContraception(item.slug);
  }

  const renderContraceptionMethod = ({ item }: { item: ContraceptionMethodInterface }) => {
    return (
      <TouchableOpacity
        style={[styles.contraceptionMethod, selectedContraception === item.slug && styles.selectedMethod]}
        onPress={() => chooseContraceptionMethod(item)}
      >
        <Text>{item.name}</Text>
        {selectedContraception === item.slug && <Feather name="check-circle" size={20} color="#000" />}
      </TouchableOpacity>
    )
  }

  return (
    <CustomModal
      title="Votre méthode de contraception"
      visible={visible}
      actionTrueText="Suivant"
      actionTrue={async () => {
        const newUser: User = {
          ...user,
          method: selectedContraception,
          wantObjectiveMinReachedNotification: selectedContraception !== ContraceptionMethods.SPERMA_PAUSE
        }

        await updateUser(newUser);
        setUser(newUser)

        additionalActionTrue();
      }}
    >
      <Text style={{textAlign: "center"}}>Quel méthode de contracepation thèrmique utilisez-vous ou souhaitez-vous utiliser ?</Text>
      <FlatList
        numColumns={1}
        style={styles.contraceptionList}
        data={getAllContraceptionMethods()}
        keyExtractor={item => item.slug}
        extraData={selectedContraception}
        renderItem={renderContraceptionMethod}
      />
    </CustomModal>
  )
}

const styles = StyleSheet.create({
  contraceptionList: {
    flexGrow: 0,
    marginVertical: 10,
  },
  contraceptionMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: '100%',
  },
  selectedMethod: {
    backgroundColor: '#ddd',
  },
});