import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { formatMilisecondsTime, isDateToday } from "@/services/date";
import { calculateTimeUntilUnreachableObjective, getColorFromStatus, getStatusFromObjective } from "@/services/session";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from 'react-native-progress';


type ProgressBarDetailsProps = {
  progressBarWidth: number,
  objective: number,
  totalWearing: number,
  date: Date
}


export default function ProgressBarDetails({ progressBarWidth, objective, totalWearing, date }: ProgressBarDetailsProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

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
          <Text style={{ color: currentTheme.text_color }}>Restant : {remaining}</Text>
          <Text style={{ color: currentTheme.text_color }}>Disponible : {available}</Text>
        </View>
        <Text style={{ color: currentTheme.text_color }}>{hour}h</Text>
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