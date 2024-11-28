interface Settings {
  autoRedirect: boolean;
}

interface SettingsStorage {
  defaultSettings: Settings;
  getSettings: () => Settings;
  setSettings: (settings: Settings) => void;
}

class SettingsStorage implements SettingsStorage {
  defaultSettings: Settings = { autoRedirect: true };

  getSettings = (): Settings => {
    const settings = localStorage.getItem("settings");
    return settings ? JSON.parse(settings) : this.defaultSettings;
  };

  setSettings = (settings: Settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
  };
}

export const settingsStorage = new SettingsStorage();
