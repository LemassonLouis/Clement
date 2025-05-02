import { User } from "./UserType";

export type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}