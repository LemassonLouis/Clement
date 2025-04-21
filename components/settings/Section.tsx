import { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"

type SectionProps = {
  name: string,
  children?: ReactNode
}

export default function Section({ name, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    backgroundColor: "#e5e5e5",
    borderColor: '#d5d5d5',
    borderBottomWidth: 1,
  }
});