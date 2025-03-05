import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"

export default function CurrentSession() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionEndTime, setSessionEndTime] = useState<Date | null>(null);
  const [sexWithoutProtection, setSexWithoutProtection] = useState(false);

  const startSession = () => {
    setSessionStarted(true);
    setSessionStartTime(new Date());
  };

  const stopSession = () => {
    setSessionStarted(false);
    const endTime = new Date();
    setSessionEndTime(endTime);
  };

  const toggleSexWithoutProtection = (value: boolean) => {
    setSexWithoutProtection(value);
  };


  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.sessionButton} onPress={sessionStarted ? stopSession : startSession}>
          <Ionicons name={sessionStarted ? 'stop-outline' : 'play-outline'} size={30} color='#000'/>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Sex sans protection</Text>
          <Switch value={sexWithoutProtection} onValueChange={toggleSexWithoutProtection} />
        </View>
      </View>

      <View style={styles.durations}>
        <View style={styles.duration}>
          <MaterialCommunityIcons name='calendar-start' size={25} color='#000'/>
          <Text style={styles.durationText}>- - -</Text>
        </View>

        <View style={styles.duration}>
          <MaterialCommunityIcons name='clock-fast' size={25} color='#000'/>
          <Text style={styles.durationText}>- - -</Text>
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'column',
  },
  sessionButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#e5e5e5',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
  },
  durations: {
    marginLeft: 20,
    justifyContent: 'space-evenly',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 10,
  }
})
