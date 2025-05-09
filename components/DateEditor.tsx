import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getStartAndEndDate } from "@/services/date";

interface DateEditorInterface {
  icon: TimeTextIcon,
  date: Date,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
  additionnalOnConfirm?: (date?: Date) => void,
}


export default function DateEditor({ icon, date, setDate, additionnalOnConfirm }: DateEditorInterface) {
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setDatePickerOpen(true)}>
        <MaterialCommunityIcons name={icon} size={25} color='#000'/>
        <Text style={styles.text}>{date.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={datePickerOpen}
        mode="date"
        date={date}
        onConfirm={thisDate => {
          const validatedDate = getStartAndEndDate(thisDate).dateStart;

          setDate(validatedDate);
          if(additionnalOnConfirm) additionnalOnConfirm(validatedDate);
          setDatePickerOpen(false);
        }}
        onCancel={() => {
          setDate(date);
          setDatePickerOpen(false);
        }}
      />
    </>
  )
}


const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    marginLeft: 10,
  },
});
