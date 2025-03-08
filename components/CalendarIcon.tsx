import { Status } from "@/enums/Status";
import { getColorFromStatus } from "@/services/session";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";


export default function CalendarIcon({ status, sexWithoutProtection, size }: CalendarIconInterface) {
  const icon = (): React.JSX.Element => {
    switch (status) {
      case Status.FAILED:
        return <Feather name="x-circle" size={size} color={getColorFromStatus(status)} />;
      case Status.WARNED:
        return <Feather name="alert-circle" size={size} color={getColorFromStatus(status)} />;
      case Status.SUCCESSED:
        return <Feather name="check-circle" size={size} color={getColorFromStatus(status)} />;
      case Status.REACHED:
        return <Feather name="check-circle" size={size} color={getColorFromStatus(status)} />;
      case Status.EXCEEDED:
        return <Feather name="alert-circle" size={size} color={getColorFromStatus(status)} />;
      default:
        return <Feather name="help-circle" size={size} color={getColorFromStatus(status)} />;
    }
  };


  return (
    <View style={[styles.iconContainer, { height: size + 5 }]}>
      {sexWithoutProtection ? <View style={[styles.circleOutline, { width: size + 10, height: size + 10, borderRadius: size }]}>{icon()}</View> : icon()}
    </View>
  )
}


const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleOutline: {
    borderWidth: 2,
    borderColor: '#777',
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
  },
})