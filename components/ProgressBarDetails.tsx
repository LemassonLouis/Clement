import { formatMilisecondsTime, isDateToday } from "@/services/date";
import { calculateTimeUntilUnreachableObjective, getColorFromStatus, getStatusFromObjective } from "@/services/session";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from 'react-native-progress';

export default function ProgressBarDetails({ progressBarWidth, objective, totalWearing, date }: {progressBarWidth: number, objective: number, totalWearing: number, date: Date}) {
  const [available, setAvailable] = useState<string>(formatMilisecondsTime(calculateTimeUntilUnreachableObjective(objective, isDateToday(date) ? new Date() : date)));
  const remaining = formatMilisecondsTime(objective - totalWearing);
  const hour = objective / 3_600_000;
  const progress = Math.min(1, totalWearing / objective);
  const color = getColorFromStatus(getStatusFromObjective(objective, isDateToday(date) ? new Date() : date));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAvailable(formatMilisecondsTime(calculateTimeUntilUnreachableObjective(objective, isDateToday(date) ? new Date() : date)));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date, objective]);

  return (
    <View style={styles.container}>
      <View style={styles.infos}>
        <View>
          <Text>Restant : {remaining}</Text>
          <Text>Disponible : {available}</Text>
        </View>
        <Text>{hour}h</Text>
      </View>
      <Progress.Bar progress={progress} width={progressBarWidth} height={10} color={color}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
    marginVertical: 10,
  },
  infos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  }
})