import { deleteSession } from "@/database/session";
import CustomModal from "./CustomModal";
import { getSessionStore } from "@/store/SessionStore";
import { reScheduleNotifications } from "@/services/notifications";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";


type DeleteSessionModalProps = {
  session: SessionInterface,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function DeleteSessionModal({ session, visible, setVisible }: DeleteSessionModalProps) {
  const { user } = useContext(UserContext);

  const sessionStore = getSessionStore();

  const actionTrue = async () => {
    await deleteSession(session.id);
    sessionStore.removeSession(session);

    await reScheduleNotifications(user);

    setVisible(false);
  }

  const actionFalse = () => {
    setVisible(false);
  }

  return (
    <CustomModal
      title="Êtes-vous sûr de vouloir supprimer cette session ?"
      visible={visible}
      actionFalseText="Non"
      actionFalse={actionFalse}
      actionTrueText="Oui"
      actionTrue={actionTrue}
    />
  )
}