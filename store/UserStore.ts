import { getUser } from "@/database/user";
import UserInterface from "@/interfaces/User";

class UserStore {
  private user: UserInterface | null = null;
  private listeners: Set<() => void> = new Set();

  public getUser(): UserInterface | null {
    return this.user;
  }

  public async loadUser(): Promise<void> {
    const user: UserInterface | null = await getUser();

    if(user) {
      if(this.user?.id !== user.id || this.user?.method !== user.method || this.user?.startDate !== user.startDate) {
        // this.user.id = user.id;
        // this.user.method = user.method;
        // this.user.startDate = user.startDate;
        this.user = user;

        this.notifyListeners();
      }
    }
  }

  public updateUser(user: UserInterface): void {
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

export function getUserStore(): UserStore {
  return userStore;
}