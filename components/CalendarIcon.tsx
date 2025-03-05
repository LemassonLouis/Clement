import { Status } from "@/enums/Status";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";


export default function CalendarIcon({ status, sexWithoutProtection }: CalendarIconInterface) {
  const icon = (): React.JSX.Element => {
    switch (status) {
      case Status.FAILED:
        return <Feather name="x-circle" size={25} color="#FF5656" />;
      case Status.WARNED:
        return <Feather name="alert-circle" size={25} color="#FFC249" />;
      case Status.SUCCESSED:
        return <Feather name="check-circle" size={25} color="#49B24E" />;
      case Status.REACHED:
        return <Feather name="check-circle" size={25} color="#6DDAFF" />;
      case Status.EXCEEDED:
        return <Feather name="alert-circle" size={25} color="#D67FFF" />;
      default:
        return <Feather name="help-circle" size={25} color="#B5B5B5" />;
    }
  };


  return (
    <View style={styles.iconContainer}>
      {sexWithoutProtection ? <View style={styles.circleOutline}>{icon()}</View> : icon()}
    </View>
  )
}


const styles = StyleSheet.create({
  iconContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleOutline: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    borderWidth: 2,
    borderColor: '#777',
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
  },
})