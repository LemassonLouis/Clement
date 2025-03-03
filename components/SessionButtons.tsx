import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"

export default function SessionButtons() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionEndTime, setSessionEndTime] = useState<Date | null>(null);
  const [hadSex, setHadSex] = useState(false);

  const startSession = () => {
    setSessionStarted(true);
    setSessionStartTime(new Date());
  };

  const stopSession = () => {
    setSessionStarted(false);
    const endTime = new Date();
    setSessionEndTime(endTime);
  };

  const toggleHadSex = (value: boolean) => {
    setHadSex(value);
  };


  return (
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.sessionButton} onPress={sessionStarted ? stopSession : startSession}>
        <Text style={styles.buttonText}>{sessionStarted ? 'Arrêter la session' : 'Démarrer une session'}</Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Had Sex</Text>
        <Switch value={hadSex} onValueChange={toggleHadSex} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
  },
  sessionButton: {
    flex: 3/5,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e5e5e5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flex: 1/5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
  }
})