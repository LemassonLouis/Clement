/**
 * Represent a delete session modal component.
 */
interface DeleteSessionModalInterface {
  session: SessionInterface,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}