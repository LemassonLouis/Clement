import { TouchableOpacity } from "react-native";
import CustomModal from "./CustomModal";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import TimeText from "./TimeText";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { formatTimefromDate } from "@/services/date";


export default function EditSessionModal({ session, visible, setVisible }: DeleteSessionModalInterface) {
  const [isStartPickerVisible, setIsStartPickerVisible] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(session.dateTimeStart);
  const [isEndPickerVisible, setIsEndPickerVisible] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<Date>(session.dateTimeEnd);

  const actionTrue = async () => {
    setVisible(false);
  }

  const actionFalse = () => {
    setVisible(false);
    setStartTime(session.dateTimeStart);
    setEndTime(session.dateTimeEnd);
  }

  return (
    <CustomModal
      title="Modification de la session"
      visible={visible}
      actionFalseText="Annuler"
      actionFalse={actionFalse}
      actionTrueText="Modifier"
      actionTrue={actionTrue}
    >
      <TouchableOpacity onPress={() => setIsStartPickerVisible(true)}>
        <TimeText icon={TimeTextIcon.CALENDAR_START} value={formatTimefromDate(startTime)} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsEndPickerVisible(true)}>
        <TimeText icon={TimeTextIcon.CALENDAR_END} value={formatTimefromDate(endTime)} />
      </TouchableOpacity>

      <TimerPickerModal
        modalTitle="Heure de début"
        initialValue={{
          hours: startTime.getHours(),
          minutes: startTime.getMinutes(),
          seconds: startTime.getSeconds()
        }}
        visible={isStartPickerVisible}
        setIsVisible={setIsStartPickerVisible}
        onConfirm={(pickedTime) => {
          setStartTime(new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            pickedTime.hours,
            pickedTime.minutes,
            pickedTime.seconds,
            startTime.getMilliseconds()
          ));

          setIsStartPickerVisible(false);
        }}
        LinearGradient={LinearGradient}
        styles={{backgroundColor: '#fff'}} 
      />

      <TimerPickerModal
        modalTitle="Heure de fin"
        initialValue={{
          hours: endTime.getHours(),
          minutes: endTime.getMinutes(),
          seconds: endTime.getSeconds()
        }}
        visible={isEndPickerVisible}
        setIsVisible={setIsEndPickerVisible}
        onConfirm={(pickedTime) => {
          setEndTime(new Date(
            endTime.getFullYear(),
            endTime.getMonth(),
            endTime.getDate(),
            pickedTime.hours,
            pickedTime.minutes,
            pickedTime.seconds,
            endTime.getMilliseconds()
          ));

          setIsEndPickerVisible(false);
        }}
        LinearGradient={LinearGradient}
        styles={{backgroundColor: '#fff'}} 
      />
    </CustomModal>
  )
}