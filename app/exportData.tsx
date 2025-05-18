import { ExportType } from "@/enums/ExportTypes";
import { exportData } from "@/services/export";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";


export default function ExportData() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Exporter mes données"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Button
        title="Exporter mes données en CSV"
        onPress={() => exportData(ExportType.CSV)}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginHorizontal: 'auto',
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 16,
  }
});