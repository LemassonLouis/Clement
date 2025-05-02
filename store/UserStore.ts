import { getUser } from "@/database/user";
import UserInterface from "@/interfaces/User";
import { User } from "@/types/UserType";

class UserStore {
  private user: User | null = null;
  private listeners: Set<() => void> = new Set();

  public getUser(): User | null {
    return this.user;
  }

  public async loadUser(): Promise<void> {
    const user: User | null = await getUser();

    if(user) {
      if(this.user?.id !== user.id
        || this.user?.method !== user.method
        || this.user?.startDate !== user.startDate
        || this.user?.wantFiveMinutesRemainingNotification !== user.wantFiveMinutesRemainingNotification
        || this.user?.wantOneHourRemainingNotification !== user.wantOneHourRemainingNotification
        || this.user?.wantTwoHoursRemainingNotification !== user.wantTwoHoursRemainingNotification
        || this.user?.wantObjectiveMinExtraReachedNotification !== user.wantObjectiveMinExtraReachedNotification
        || this.user?.wantObjectiveMinReachedNotification !== user.wantObjectiveMinReachedNotification
        || this.user?.wantObjectiveMaxReachedNotification !== user.wantObjectiveMaxReachedNotification
        || this.user?.wantObjectiveMaxExtraReachedNotification !== user.wantObjectiveMaxExtraReachedNotification
      ) {
        this.user = user;

        this.notifyListeners();
      }
    }
  }

  public updateUser(user: User): void {
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