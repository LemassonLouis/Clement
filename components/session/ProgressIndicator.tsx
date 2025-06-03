import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";


type ProgressIndicatorProps = {
  hour: number,
  progressBarWidth: number,
  isTop: boolean,
}


export default function ProgressIndicator({ hour, progressBarWidth, isTop }: ProgressIndicatorProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  return (
    <View style={[styles.indicator, isTop && styles.indicatorTop, { left: hour * progressBarWidth / 24 }]}>
      {!isTop && <Text style={{ color: currentTheme.text_color }}>|</Text>}
      <Text style={[styles.indicatorText, { color: currentTheme.text_color }]}>{hour}h</Text>
      {isTop && <Text style={{ color: currentTheme.text_color }}>|</Text>}
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
