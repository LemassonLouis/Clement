import { Feather } from "@expo/vector-icons"
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native"

type SectionOptionProps = {
  name: string,
  navigateTo: string,
  navigateProps?: Object
}

export default function SectionOption({ name, navigateTo, navigateProps }: SectionOptionProps) {
  const navigation = useNavigation<any>();
  
  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate(navigateTo, navigateProps)}>
      <Text style={styles.title}>{name}</Text>
      <Feather name="chevron-right" size={25} color='#000'/>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#f5f5f5',
    borderColor: '#d5d5d5',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
  }
})