import { formatMilisecondsTime, formatTimefromDate, getDateDifference } from "@/services/date";
import { Feather } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DeleteSessionModal from "../modals/DeleteSessionModal";
import EditSessionModal from "../modals/EditSessionModal";
import TimeText from "../dateAndTime/TimeText";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { Session } from "@/types/SessionType";
import SessionNote from "./SessionNote";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


export default function SessionCard(session: Session) {
  if(!session.dateTimeEnd) return;

  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const [deleteModalVisible, setDeleteSessionModalVisible] = useState(false);
  const [editModalVisible, setEditSessionModalVisible] = useState(false);

  const elapsedTime: number = getDateDifference(session.dateTimeStart, session.dateTimeEnd);
  const wearingTime: string = formatMilisecondsTime(elapsedTime);
  const startTime: string = formatTimefromDate(session.dateTimeStart);
  const endTime: string = formatTimefromDate(session.dateTimeEnd);


  return (
    <View style={styles.session}>
      <DeleteSessionModal session={session} visible={deleteModalVisible} setVisible={setDeleteSessionModalVisible}/>
      <EditSessionModal session={session} visible={editModalVisible} setVisible={setEditSessionModalVisible}/>

      <View style={styles.sessionInfoContainer}>
        <TimeText icon={TimeTextIcon.CALENDAR_START} value={startTime} />
        <TimeText icon={TimeTextIcon.CLOCK_FAST} value={wearingTime} />
        <TimeText icon={TimeTextIcon.CALENDAR_END} value={endTime} />
      </View>

      <View style={styles.buttonsContainer}>
        <SessionNote session={session}/>

        <View>
          <TouchableOpacity style={styles.button} onPress={() => setEditSessionModalVisible(true)}>
            <Feather name='edit-3' size={20} color={currentTheme.text_color}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setDeleteSessionModalVisible(true)}>
            <Feather name='trash-2' size={20} color='#f00'/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}



const styles = StyleSheet.create({
  session: {
    flex: 8/10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  sessionInfoContainer: {
    gap: 3,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    marginRight: 10,
    padding: 10,
    borderRadius: 50,
  },
});
