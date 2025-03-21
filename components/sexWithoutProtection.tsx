import { updateSessionsSexWithoutProtection } from "@/database/session";
import { extractDateSessions, hasSessionsSexWithoutProtection } from "@/services/session";
import { getSessionsStored, getSessionStore } from "@/store/SessionStore";
import { memo, useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";


function SexWithoutProtection({ date }: {date: Date}) {
  const sessionStore = getSessionStore();
  const sessionsStored = getSessionsStored();
  const currentSessions = extractDateSessions(sessionsStored, date);

  const [sexWithoutProtection, setSexWithoutProtection] = useState<boolean>(hasSessionsSexWithoutProtection(currentSessions));


  // Load sexWithoutProtectionState
  useEffect(() => {
    setSexWithoutProtection(hasSessionsSexWithoutProtection(currentSessions));
  }, [sessionsStored]);


  const toggleSexWithoutProtection = (toggleValue: boolean) => {
    setSexWithoutProtection(toggleValue);

    const updateStoredInfos = async () => {
      const ids = currentSessions.reduce<number[]>((prev, curr) => [curr.id, ...prev], []);
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