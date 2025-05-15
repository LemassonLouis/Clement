import { Session } from "@/types/SessionType";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomModal from "./modals/CustomModal";
import { useState } from "react";
import { updateSession } from "@/database/session";
import { getSessionStore } from "@/store/SessionStore";


type SessionNoteProps = {
  session: Session | null,
  disabled?: boolean,
}


export default function SessionNote({ session, disabled = false }: SessionNoteProps) {
  const [sessionNoteModalVisible, setSessionNoteModalVisible] = useState<boolean>(false);
  const [note, setNote] = useState<string>(session?.note ?? "");

  return(
    <>
      <TouchableOpacity style={[styles.button, disabled && {opacity: 0.4}]} onPress={() => setSessionNoteModalVisible(true)} disabled={disabled}>
        <Ionicons name='document-text-outline' size={20} color='#000'/>
      </TouchableOpacity>

      <CustomModal
        title="Note de session"
        visible={sessionNoteModalVisible}
        actionFalseText="Annuler"
        actionFalse={() => {
          setNote(session!.note ?? "");
          setSessionNoteModalVisible(false)
        }}
        actionTrueText="Modifier"
        actionTrue={async () => {
          // TODO : update session
          const newSession: Session = {
            ...session!,
            note: note
          }

          await updateSession(newSession);
          getSessionStore().updateSessions([newSession]);

          setSessionNoteModalVisible(false);
        }}
      >
        <TextInput
          editable
          multiline
          numberOfLines={8}
          maxLength={1000}
          onChangeText={text => setNote(text)}
          value={note}
          placeholder="Annotation"
          style={styles.input}
        />
      </CustomModal>
    </>
  )
}


const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#e5e5e5',
  },
  inputContainer: {
    borderWidth: 1
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e5e5e5',
  }
})