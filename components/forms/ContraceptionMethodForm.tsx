import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { updateUser } from "@/database/user";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { ContraceptionMethodInterface } from "@/interfaces/ContraceptionMethod";
import { getTheme } from "@/services/appStyle";
import { getAllContraceptionMethods } from "@/services/contraception";
import { User } from "@/types/UserType";
import { Feather } from "@expo/vector-icons";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";


type ContraceptionMethodFormProps = {
  autoValidate?: boolean
}


const ContraceptionMethodFrom = forwardRef(({ autoValidate = false }: ContraceptionMethodFormProps, ref) => {
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const [selectedContraception, setSelectedContraception] = useState<ContraceptionMethods>(user.method);
  
  const chooseContraceptionMethod = (item: ContraceptionMethodInterface) => {
    setSelectedContraception(item.slug);

    if(autoValidate) {
      saveForm(item.slug)
    }
  }

  const saveForm = async (method: ContraceptionMethods = selectedContraception) => {
    const newUser: User = {
      ...user,
      method: method
    }

    await updateUser(newUser);
    setUser(newUser);
  }

  useImperativeHandle(ref, () => ({
    saveForm,
  }));

  const renderContraceptionMethod = ({ item }: { item: ContraceptionMethodInterface }) => {
    return (
      <TouchableOpacity
        style={[styles.contraceptionMethod, selectedContraception === item.slug && { backgroundColor: currentTheme.background_3 }]}
        onPress={() => chooseContraceptionMethod(item)}
      >
        <Text style={{ color: currentTheme.text_color }}>{item.name}</Text>
        {selectedContraception === item.slug && <Feather name="check-circle" size={20} color={currentTheme.text_color} />}
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      numColumns={1}
      style={[styles.contraceptionList, { backgroundColor: currentTheme.background_2 }]}
      data={getAllContraceptionMethods()}
      keyExtractor={item => item.slug}
      extraData={selectedContraception}
      renderItem={renderContraceptionMethod}
    />
  )
});


export default ContraceptionMethodFrom;


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
});