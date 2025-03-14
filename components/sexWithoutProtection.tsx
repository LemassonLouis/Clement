import { getAllSessionsBetweenDates, updateSession } from "@/database/session";
import { getStartAndEndDate } from "@/services/date";
import { extractDateSessions } from "@/services/session";
import { getSessionStore } from "@/store/SessionStore";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";


export default function SexWithoutProtection({ date, sexWithoutProtection, setSexWithoutProtection }: SexWithoutProtectionInterace) {
  const sessionStore = getSessionStore();
  const sessionsStored = useSyncExternalStore(
    useCallback((callback) => sessionStore.subscribe(callback), [sessionStore]),
    useCallback(() => sessionStore.getSessions(), [sessionStore])
  );

  const [daySessions, setDaySessions] = useState<SessionInterface[]>([]);

  // Load sexWithoutProtectionState
  useEffect(() => {
    const fetchData = async () => {
      const { dateStart, dateEnd } = getStartAndEndDate(date);
      const currentSessions = await getAllSessionsBetweenDates(dateStart.toISOString(), dateEnd.toISOString());
      setDaySessions(currentSessions);
      const sexWithoutProtection = currentSessions.some(session => session.sexWithoutProtection === true);
      setSexWithoutProtection(sexWithoutProtection);
    }

    fetchData();
  }, []);


  const toggleSexWithoutProtection = (value: boolean) => {
    setSexWithoutProtection(value);

    const updateStoredInfos = async (value: boolean) => {
      daySessions.forEach(async session => {
        const sessionStored = sessionsStored.find(sessionStored => sessionStored.id === session.id);

        if(sessionStored) {
          sessionStored.sexWithoutProtection = value;
          sessionStore.updateSession(sessionStored);

          await updateSession(session.id, sessionStored.dateTimeStart.toISOString(), sessionStored.dateTimeEnd?.toISOString() ?? null, sessionStored.sexWithoutProtection);
        }

      });
    }

    updateStoredInfos(value);
  };

  if(extractDateSessions(daySessions, date).length < 1) return;

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