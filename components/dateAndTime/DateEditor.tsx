import { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getStartAndEndDate } from "@/services/date";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type DateEditorProps = {
  icon: TimeTextIcon,
  date: Date,
  setDate: React.Dispatch<React.SetStateAction<Date>>,
  additionnalOnConfirm?: (date?: Date) => void,
}


export default function DateEditor({ icon, date, setDate, additionnalOnConfirm }: DateEditorProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setDatePickerOpen(true)}>
        <MaterialCommunityIcons name={icon} size={25} color={currentTheme.text_color}/>
        <Text style={[styles.text, { color: currentTheme.text_color }]}>{date.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>
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
