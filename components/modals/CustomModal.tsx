import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { ReactNode, useContext } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";


type CustomModalProps = {
  visible: boolean,
  title: string,
  actionTrueText?: string,
  actionFalseText?: string | null,
  actionTrue?: (() => void),
  actionFalse?: (() => void) | null,
  children?: ReactNode | null,
}


export default function CustomModal({
  visible,
  title,
  actionTrueText = 'OK',
  actionFalseText = null,
  actionTrue = () => { visible = false },
  actionFalse = null,
  children = null
}: CustomModalProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modal}>
        <View style={[styles.modalContainer, { backgroundColor: currentTheme.background_1 }]}>
          <Text style={[styles.modalTitle, { color: currentTheme.text_color }]}>{title}</Text>

          {children && <View style={styles.modalContent}>{children}</View>}

          <View style={styles.modalButtons}>
            {actionFalseText && <Pressable
            style={styles.modalButton}
              onPress={actionFalse}>
              <Text style={[styles.buttonText, styles.modalButtonActionFalseText]}>{actionFalseText}</Text>
            </Pressable>}
            <Pressable
              style={[styles.modalButton, styles.modalButtonActionTrue, { backgroundColor: currentTheme.background_2 }]}
              onPress={actionTrue}>
              <Text style={[styles.buttonText, { color: currentTheme.text_color }]}>{actionTrueText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Toasts providerKey="MODAL::1" />
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
    width: '90%',
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
    fontSize: 18,
  },
  modalContent: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  modalButtonActionTrue: {
    backgroundColor: '#ddd',
  },
  modalButtonActionFalseText: {
    color: '#f00',
  }
});
