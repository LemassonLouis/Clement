import { StyleSheet, Text, View } from "react-native";


type ProgressIndicatorProps = {
  hour: number,
  progressBarWidth: number,
  isTop: boolean,
}


export default function ProgressIndicator({ hour, progressBarWidth, isTop }: ProgressIndicatorProps) {
  return (
    <View style={[styles.indicator, isTop && styles.indicatorTop, { left: hour * progressBarWidth / 24 }]}>
      {!isTop && <Text>|</Text>}
      <Text style={styles.indicatorText}>{hour}h</Text>
      {isTop && <Text>|</Text>}
    </View>
  )
}


const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    transform: [
      { translateX: '-50%'},
      { translateY: -5.25},
    ],
  },
  indicatorTop: {
    transform: [
      { translateX: '-50%'},
      { translateY: -24.5},
    ],
  },
  indicatorText: {
    fontWeight: '500',
  }
});
