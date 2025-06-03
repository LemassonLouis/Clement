import { ThemeContext } from "@/context/ThemeContext";
import { getAllSessionsBetweenDates, updateSessionsSexWithoutProtection } from "@/database/session";
import { getTheme } from "@/services/appStyle";
import { getStartAndEndDate, isDateToday } from "@/services/date";
import { hasSessionsSexWithoutProtection } from "@/services/session";
import { getSessionsStored, getSessionStore } from "@/store/SessionStore";
import { memo, useContext, useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";


type SexWithoutProtectionProps = {
  date: Date
}


function SexWithoutProtection({ date }: SexWithoutProtectionProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const sessionStore = getSessionStore();
  const [currentSessions, setCurrentSessions] = useState<any[]>([]);
  const [sexWithoutProtection, setSexWithoutProtection] = useState<boolean>(false);

  // Load sexWithoutProtectionState
  useEffect(() => {
    const fetchSessions = async () => {
      const { dateStart, dateEnd } = getStartAndEndDate(date);
      const sessions = await getAllSessionsBetweenDates(dateStart.toISOString(), dateEnd.toISOString(), isDateToday(date));
      const newHasSessionsSexWithoutProtection = hasSessionsSexWithoutProtection(sessions)
      setCurrentSessions(sessions);
      setSexWithoutProtection(newHasSessionsSexWithoutProtection);
    };

    fetchSessions();
  }, [date, getSessionsStored()]);


  const toggleSexWithoutProtection = (toggleValue: boolean) => {
    setSexWithoutProtection(toggleValue);

    const updateStoredInfos = async () => {
      const ids = currentSessions.map(session => session.id);
      await updateSessionsSexWithoutProtection(ids, toggleValue);

      const updatedSessions = currentSessions.map(session => {
        return {
          ...session,
          sexWithoutProtection: toggleValue
        }
      });
      sessionStore.updateSessions(updatedSessions);
    }

    updateStoredInfos();
  };

  const disabled = currentSessions.length < 1;

  return (
    <View style={styles.switchContainer}>
      <Text style={[styles.switchText, { color: currentTheme.text_color }, disabled && {opacity: 0.4}]}>Rapport sexuel sans protection</Text>
      <Switch
        style={styles.switch}
        thumbColor={sexWithoutProtection ? currentTheme.background_3 : currentTheme.background_2}
        trackColor={{ false: currentTheme.background_3, true: currentTheme.text_color_2 }}
        value={sexWithoutProtection}
        onValueChange={toggleSexWithoutProtection}
        disabled={disabled}
      />
    </View>
  )
}

export default memo(SexWithoutProtection);


const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    marginTop: 2,
    fontSize: 16,
  },
  switch: {
    marginTop: 5,
    marginLeft: 2,
  }
});