import { formatElapsedTime, getDateDifference } from "@/services/date";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function Session(session: SessionInterface) {
  if(!session.date_time_end) return;

  const elapsedTime: number = getDateDifference(session.date_time_start, session.date_time_end);
  const wearingTime: string = formatElapsedTime(elapsedTime);
  const startTime: string = `${session.date_time_start.getHours()}h ${session.date_time_start.getMinutes()}m ${session.date_time_start.getSeconds()}s`;
  const endTime: string = `${session.date_time_end.getHours()}h ${session.date_time_end.getMinutes()}m ${session.date_time_end.getSeconds()}s`;


  const handleEditButtonPress = () => {

  }


  return (
    <View style={styles.session}>
      {/* <Modal>
        
      </Modal> */}

      <View style={styles.sessionInfoContainer}>
        <View style={styles.sessionInfo}>
          <MaterialCommunityIcons name='calendar-start' size={25} color='#000'/>
          <Text style={styles.infoText}>{startTime}</Text>
        </View>

        <View style={[styles.sessionInfo, styles.sessionInfoTime]}>
          <MaterialCommunityIcons name='clock-fast' size={25} color='#000'/>
          <Text style={styles.infoText}>{wearingTime}</Text>
        </View>

        <View style={styles.sessionInfo}>
          <MaterialCommunityIcons name='calendar-end' size={25} color='#000'/>
          <Text style={styles.infoText}>{endTime}</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditButtonPress}>
          <Feather name='edit-3' size={30} color='#000'/>
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
  editButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 50,
  }
});
