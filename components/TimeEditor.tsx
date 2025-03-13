import { TimerPicker } from "react-native-timer-picker";
import CustomModal from "./CustomModal";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import TimeText from "./TimeText";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { formatTimefromDate } from "@/services/date";
import { LinearGradient } from "expo-linear-gradient";


interface TimeEditorInterface {
  icon: TimeTextIcon,
  date: Date,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
}


export default function TimeEditor({ icon, date, setDate }: TimeEditorInterface) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(date);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <TimeText icon={icon} value={formatTimefromDate(date)} />
      </TouchableOpacity>

      <CustomModal
        title="Heure de début"
        visible={modalVisible}
        actionFalseText="Annuler"
        actionTrueText="Confirmer"
        actionFalse={() => {
          setTime(date);
          setModalVisible(false);
        }}
        actionTrue={() => {
          setDate(time);
          setModalVisible(false);
        }}
      >
        <TimerPicker
          initialValue={{
            hours: time.getHours(),
            minutes: time.getMinutes(),
            seconds: time.getSeconds()
          }}
          onDurationChange={(pickedTime) => {
            setTime(new Date(
              time.getFullYear(),
              time.getMonth(),
              time.getDate(),
              pickedTime.hours,
              pickedTime.minutes,
              pickedTime.seconds,
              time.getMilliseconds()
            ));
          }}
          LinearGradient={LinearGradient}
          styles={{backgroundColor: '#fff'}} 
        />
      </CustomModal>
    </>
  )
}


const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  }
});
