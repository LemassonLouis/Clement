import { ImportType } from "@/enums/ImportTypes";
import { importData } from "@/services/import";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";


export default function ImportData() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Importer des données"});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Button
        title="Importer des données depuis un CSV"
        onPress={() => importData(ImportType.CSV)}
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