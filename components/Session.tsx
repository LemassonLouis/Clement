import { formatMilisecondsTime, formatTimefromDate, getDateDifference } from "@/services/date";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DeleteSessionModal from "./DeleteSessionModal";
import EditSessionModal from "./EditSessionModal";
import TimeText from "./TimeText";
import { TimeTextIcon } from "@/enums/TimeTextIcon";


export default function Session(session: SessionInterface) {
  if(!session.dateTimeEnd) return;

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const elapsedTime: number = getDateDifference(session.dateTimeStart, session.dateTimeEnd);
  const wearingTime: string = formatMilisecondsTime(elapsedTime);
  const startTime: string = formatTimefromDate(session.dateTimeStart);
  const endTime: string = formatTimefromDate(session.dateTimeEnd);


  return (
    <View style={styles.session}>
      <DeleteSessionModal session={session} visible={deleteModalVisible} setVisible={setDeleteModalVisible}/>
      <EditSessionModal session={session} visible={editModalVisible} setVisible={setEditModalVisible}/>

      <View style={styles.sessionInfoContainer}>
        <TimeText icon={TimeTextIcon.CALENDAR_START} value={startTime} />
        <TimeText icon={TimeTextIcon.CLOCK_FAST} value={wearingTime} />
        <TimeText icon={TimeTextIcon.CALENDAR_END} value={endTime} />
      </View>

      <View>
        <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(true)}>
          <Feather name='edit-3' size={20} color='#000'/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setDeleteModalVisible(true)}>
          <Feather name='trash-2' size={20} color='#f00'/>
        </TouchableOpacity>
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
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionInfoTime: {
    // marginLeft: 10,
  },
  infoText: {
    marginLeft: 5,
  },
  button: {
    marginRight: 10,
    padding: 10,
    borderRadius: 50,
  },
});
