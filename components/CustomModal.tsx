import CustomModalInterface from "@/interfaces/CustomModal";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";


export default function CustomModal({
  visible,
  title,
  actionTrueText = null,
  actionFalseText = null,
  actionTrue = null,
  actionFalse = null,
  children = null
}: CustomModalInterface) {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>

          {children ? <View style={styles.modalContent}>{children}</View> : ''}

          <View style={styles.modalButtons}>
            <Pressable
              onPress={actionFalse}>
              <Text style={styles.modalButtonActionFalseText}>{actionFalseText}</Text>
            </Pressable>
            <Pressable
              style={styles.modalButtonActionTrue}
              onPress={actionTrue}>
              <Text>{actionTrueText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}


const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  modalContainer: {
    alignItems: 'center',
    margin: 20,
    padding: 35,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContent: {
    marginTop: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  },
  modalButtonActionTrue: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  modalButtonActionFalseText: {
    color: '#f00',
  }
});
