import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { updateUser } from "@/database/user";
import { AppStyles } from "@/enums/AppStyles";
import { AppStyleInterface } from "@/interfaces/AppStyle";
import { getAllAppStyles, getAppStyle, getTheme } from "@/services/appStyle";
import { User } from "@/types/UserType";
import { Feather } from "@expo/vector-icons";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";


type UserStyleFormProps = {
  autoValidate?: boolean
}


const UserStyleForm = forwardRef(({ autoValidate = false }: UserStyleFormProps, ref) => {
  const { user, setUser } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const [selectedStyle, setSelectedStyle] = useState<AppStyles>(user.style);

  const chooseAppStyle = (item: AppStyleInterface) => {
    setSelectedStyle(item.slug);

    if(autoValidate) {
      saveForm(item.slug)
    }
  }

  const saveForm = async (style: AppStyles = selectedStyle) => {
    const newUser: User = {
      ...user,
      style: style
    }

    await updateUser(newUser);
    setUser(newUser);
    setTheme(getAppStyle(style));
  }

  useImperativeHandle(ref, () => ({
    saveForm,
  }));

  const renderAppStyle = ({ item }: { item: AppStyleInterface }) => {
    return (
      <TouchableOpacity
        style={[styles.contraceptionMethod, selectedStyle === item.slug && { backgroundColor: currentTheme.background_3 }]}
        onPress={() => chooseAppStyle(item)}
      >
        <Text style={{ color: currentTheme.text_color }}>{item.name}</Text>
        {selectedStyle === item.slug && <Feather name="check-circle" size={20} color={currentTheme.text_color} />}
      </TouchableOpacity>
    )
  }
  
  return (
    <FlatList
      numColumns={1}
      style={[styles.contraceptionList, { backgroundColor: currentTheme.background_2 }]}
      data={getAllAppStyles()}
      keyExtractor={item => item.slug}
      extraData={selectedStyle}
      renderItem={renderAppStyle}
    />
  )
});


export default UserStyleForm;


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