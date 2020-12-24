enum PermissionAccess {
  NOT_SUPPORTED,
  GRANTED,
  NOT_GRANTED,
  DENIED
}

export default class Notify {
  constructor(private icon: string) {
    
  }

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
      if (permission === 'granted') {
        return true;
      }
    }
    return false;
  }

  public checkPermission() {
    if (!('Notification' in window)) {
      return PermissionAccess.NOT_SUPPORTED;
    }
    else if (Notification.permission === 'granted') {
      return PermissionAccess.GRANTED;
    }
    else if (Notification.permission !== 'denied') {
      return PermissionAccess.NOT_GRANTED;
    }
    return PermissionAccess.DENIED;
  }

  public notify(title: string, body: string, timeout?: number) {
    let notification = new Notification(title, {
      icon: this.icon,
      body,
    });
    if (timeout) {
      setTimeout(() => notification.close(), timeout)
    }
  }
}