import NotificationSwitch from "@/components/notifications/NotificationSwitch";
import { UserContext } from "@/context/UserContext";
import { getContraceptionMethod } from "@/services/contraception";
import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function Notifications() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  const contraceptionMethod = getContraceptionMethod(user.method);
  const notSameObjectiveMinMax = contraceptionMethod.objective_min !== contraceptionMethod.objective_max;

  useEffect(() => {
    navigation.setOptions({ title: "Notifications"});
  }, [navigation]);


  return (
    <View style={styles.container}>
      <NotificationSwitch label="Plus que 5 min !" userSettingKey="wantFiveMinutesRemainingNotification"/>
      <NotificationSwitch label="Plus que 1h !" userSettingKey="wantOneHourRemainingNotification"/>
      <NotificationSwitch label="Plus que 2h !" userSettingKey="wantTwoHoursRemainingNotification"/>
      <NotificationSwitch label={`Objectif de ${contraceptionMethod.objective_min_extra / 3_600_000}h atteint`} userSettingKey="wantObjectiveMinExtraReachedNotification"/>
      <NotificationSwitch label={`Objectif de ${contraceptionMethod.objective_min / 3_600_000}h atteint`} userSettingKey="wantObjectiveMinReachedNotification"/>
      {notSameObjectiveMinMax && <NotificationSwitch label={`Objectif de ${contraceptionMethod.objective_max / 3_600_000}h atteint`} userSettingKey="wantObjectiveMaxReachedNotification"/>}
      <NotificationSwitch label={`Objectif de ${contraceptionMethod.objective_max_extra / 3_600_000}h atteint`} userSettingKey="wantObjectiveMaxExtraReachedNotification"/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40
  }
})