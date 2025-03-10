import { getAllSessionsBetweenDates, updateSessionSexWithoutProtection } from "@/database/session";
import { getStartAndEndDate } from "@/services/date";
import { extractDateSessions } from "@/services/session";
import { getSessionStore } from "@/store/SessionStore";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";


export default function SexWithoutProtection({ date, sexWithoutProtection, setSexWithoutProtection }: SexWithoutProtectionInterace) {
  const sessionStore = getSessionStore();
  const sessionsStored = useSyncExternalStore(
    useCallback((callback) => sessionStore.subscribe(callback), [sessionStore]),
    useCallback(() => sessionStore.getSessions(), [sessionStore])
  );

  // Load sexWithoutProtectionState
  useEffect(() => {
    const currentSessions = extractDateSessions(sessionsStored, date);
    const sexWithoutProtection = currentSessions.some(session => session.sexWithoutProtection === true);
    setSexWithoutProtection(sexWithoutProtection);
  }, [sessionsStored]);


  const toggleSexWithoutProtection = (value: boolean) => {
    setSexWithoutProtection(value);

    const updateStoredInfos = async (value: boolean) => {
      const { dateStart, dateEnd } = getStartAndEndDate(date);
      const sessions = await getAllSessionsBetweenDates(dateStart.toISOString(), dateEnd.toISOString());
  
      sessions.forEach(async session => {
        const sessionStored = sessionsStored.find(sessionStored => sessionStored.id === session.id);
  
        if(sessionStored) {
          sessionStored.sexWithoutProtection = value;
          sessionStore.updateSession(sessionStored);
        }
  
        await updateSessionSexWithoutProtection(session.id, value)
      });
    }

    updateStoredInfos(value);
  };

  if(extractDateSessions(sessionsStored, date).length < 1) return;

  return (
    <View style={styles.switchContainer}>
      <Text style={styles.switchText}>Rapport sexuel sans protection</Text>
      <Switch style={styles.switch} value={sexWithoutProtection} onValueChange={toggleSexWithoutProtection} />
    </View>
  )
}


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