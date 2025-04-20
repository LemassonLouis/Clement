import { getAllSessionsBetweenDates, updateSessionsSexWithoutProtection } from "@/database/session";
import { getStartAndEndDate } from "@/services/date";
import { hasSessionsSexWithoutProtection } from "@/services/session";
import { getSessionStore } from "@/store/SessionStore";
import { memo, useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";


type SexWithoutProtectionProps = {
  date: Date
}


function SexWithoutProtection({ date }: SexWithoutProtectionProps) {
  const sessionStore = getSessionStore();
  const [currentSessions, setCurrentSessions] = useState<any[]>([]);
  const [sexWithoutProtection, setSexWithoutProtection] = useState<boolean>(false);

  console.log("date", date)

  // Load sexWithoutProtectionState
  useEffect(() => {
    const fetchSessions = async () => {
      const { dateStart, dateEnd } = getStartAndEndDate(date);
      const sessions = await getAllSessionsBetweenDates(dateStart.toISOString(), dateEnd.toISOString());
      const newHasSessionsSexWithoutProtection = hasSessionsSexWithoutProtection(sessions)
      setCurrentSessions(sessions);
      setSexWithoutProtection(newHasSessionsSexWithoutProtection);
      console.log("sessions", sessions) // TEMP
      console.log("newHasSessionsSexWithoutProtection", newHasSessionsSexWithoutProtection) // TEMP
    };


    fetchSessions();
  }, [date]);


  const toggleSexWithoutProtection = (toggleValue: boolean) => {
    setSexWithoutProtection(toggleValue);

    const updateStoredInfos = async () => {
      const ids = currentSessions.map(session => session.id);
      await updateSessionsSexWithoutProtection(ids, toggleValue);

      const updatedSessions = currentSessions.map(session => {
        return {
          id: session.id,
          dateTimeStart: session.dateTimeStart,
          dateTimeEnd: session.dateTimeEnd,
          sexWithoutProtection: toggleValue
        }
      });
      sessionStore.updateSessions(updatedSessions);
    }

    updateStoredInfos();
  };

  if(currentSessions.length < 1) return;

  return (
    <View style={styles.switchContainer}>
      <Text style={styles.switchText}>Rapport sexuel sans protection</Text>
      <Switch style={styles.switch} value={sexWithoutProtection} onValueChange={toggleSexWithoutProtection} />
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