import { TimerPicker } from "react-native-timer-picker";
import CustomModal from "../modals/CustomModal";
import { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import TimeText from "./TimeText";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { formatTimefromDate } from "@/services/date";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type TimeEditorProps = {
  icon: TimeTextIcon,
  date: Date | null,
  setDate: (date: Date) => void,
}


export default function TimeEditor({ icon, date, setDate }: TimeEditorProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(() => date ?? new Date());

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => { if(date) setModalVisible(true) }}>
        <TimeText icon={icon} value={date ? formatTimefromDate(date) : null} />
      </TouchableOpacity>

      <CustomModal
        title="Heure de début"
        visible={modalVisible}
        actionFalseText="Annuler"
        actionTrueText="Confirmer"
        actionFalse={() => {
          setTime(date ?? new Date());
          setModalVisible(false);
        }}
        actionTrue={() => {
          setDate(time);
          setModalVisible(false);
        }}
      >
        <TimerPicker
          initialValue={{
            hours: time?.getHours(),
            minutes: time?.getMinutes(),
            seconds: time?.getSeconds()
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
          styles={{
            backgroundColor: currentTheme.background_1,
            text: {
              color: currentTheme.text_color,
            },
            pickerContainer: {
              justifyContent: 'center',
              width: '100%',
            },
            pickerItemContainer: {
              width: 50,
              marginRight: 12,
            },
            pickerItem: {
              fontSize: 22,
            },
          }}
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
