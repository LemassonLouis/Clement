import { getUser } from "@/database/user";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import UserInterface from "@/interfaces/User";

class UserStore {
  private user: UserInterface = {
    id: 0,
    method: ContraceptionMethods.ANDRO_SWITCH,
    startDate: new Date(),
  }
  private listeners: Set<() => void> = new Set();

  public getUser() {
    return this.user;
  }

  public async loadUser(): Promise<void> {
    const user: UserInterface | null = await getUser();

    if(user) {
      if(this.user.id !== user.id || this.user.method !== user.method || this.user.startDate !== user.startDate) {
        // this.user.id = user.id;
        // this.user.method = user.method;
        // this.user.startDate = user.startDate;
        this.user = user;

        this.notifyListeners();
      }
    }
  }

  public updateUser(user: UserInterface) {
    this.user = user;

    this.notifyListeners();
  }


  public subscribe(listener: () => void) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

const userStore = new UserStore();

export function getUserStore() {
  return userStore;
}