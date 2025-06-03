import Section from "@/components/settings/Section";
import SectionOption from "@/components/settings/SectionOption";
import { View, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Section name="Contraception">
        <SectionOption name="Méthode de contraception" navigateTo="contraceptionMethod"/>
        <SectionOption name="Date de début de contraception" navigateTo="contraceptionStartDate"/>
        <SectionOption name="Exporter mes données" navigateTo="exportData"/>
        <SectionOption name="Importer des données" navigateTo="importData"/>
      </Section>

      <Section name="Général">
        <SectionOption name="Notifications" navigateTo="notifications"/>
        <SectionOption name="Style de l'application" navigateTo="appStyle"/>
        <SectionOption name="À propos" navigateTo="about"/>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});