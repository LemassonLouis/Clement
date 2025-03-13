import { StyleSheet, Text, View } from "react-native";


export default function ErrorsDisplayer({ errors }: {errors: string[]}) {
  if(errors.length > 0) {
    return (
      <View style={styles.errors}>
        {errors.map((error, index) => <Text key={index} style={styles.error}>{error}</Text>)}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  errors: {
    marginTop: 20,
    gap: 10,
  },
  error: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontWeight: 500,
    backgroundColor: '#FF5656',
    borderRadius: 10,
  }
});
