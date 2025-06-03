import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { updateUser } from "@/database/user";
import { getTheme } from "@/services/appStyle";
import { reScheduleNotifications } from "@/services/notifications";
import { User } from "@/types/UserType";
import { useContext, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";


type NotificationSwitchProps = {
  label: string,
  userSettingKey: keyof Pick<
    User,
    | "wantFiveMinutesRemainingNotification"
    | "wantOneHourRemainingNotification"
    | "wantTwoHoursRemainingNotification"
    | "wantObjectiveMinExtraReachedNotification"
    | "wantObjectiveMinReachedNotification"
    | "wantObjectiveMaxReachedNotification"
    | "wantObjectiveMaxExtraReachedNotification"
  >;
}


export default function NotificationSwitch({ label, userSettingKey }: NotificationSwitchProps) {
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const [value, setValue] = useState<boolean>(user[userSettingKey])

  const handleChange = async (newValue: boolean) => {
    setValue(newValue);

    const newUser = {
      ...user,
      [userSettingKey]: newValue,
    };

    await updateUser(newUser);
    setUser(newUser);

    reScheduleNotifications(newUser);
  }


  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: currentTheme.text_color }]}>{label}</Text>
      <Switch
        style={styles.switch}
        thumbColor={value ? currentTheme.background_3 : currentTheme.background_2}
        trackColor={{ false: currentTheme.background_3, true: currentTheme.text_color_2 }}
        value={value}
        onValueChange={handleChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    marginTop: 2,
    fontSize: 16,
  },
  switch: {
    marginTop: 5,
    marginLeft: 2,
  }
});