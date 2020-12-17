enum PermissionAccess {
  NOT_SUPPORTED,
  GRANTED,
  NOT_GRANTED,
  DENIED
}

export default class Notify {
  public async requestPermission(): Promise<boolean> {
    let permission = this.checkPermission();
    if (permission == PermissionAccess.NOT_SUPPORTED) {
      return false;
    }
    else if (permission == PermissionAccess.GRANTED) {
      return true;
    } else if (permission == PermissionAccess.DENIED) {
      return false;
    } else {
      let permission = await Notification.requestPermission();
      if (permission === "granted") {
        return true;
      }
    }
    return false;
  }

  public checkPermission() {
    if (!("Notification" in window)) {
      return PermissionAccess.NOT_SUPPORTED;
    }
    else if (Notification.permission === "granted") {
      return PermissionAccess.GRANTED;
    }
    else if (Notification.permission !== "denied") {
      return PermissionAccess.NOT_GRANTED;
    }
    return PermissionAccess.DENIED;
  }

  public notify_delay(message: string, delay: number) {
    console.log("hello")
    let callback = () => {
      this.notify(message);
    }
    setTimeout(callback, delay);
  }

  public notify(message: string) {
    new Notification(message);
  }
}