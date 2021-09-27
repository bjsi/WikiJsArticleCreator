import { Notice } from "obsidian";

export class LogTo {
  static getTime() {
    return new Date().toTimeString().substr(0, 8);
  }

  static Debug(message: string, notify: boolean = false) {
    console.debug(`[${LogTo.getTime()}] (Wiki.js Utils): ${message}`);
    if (notify) new Notice(message);
  }

  static Console(message: string, notify: boolean = false) {
    console.log(`[${LogTo.getTime()}] (Wiki.js Utils): ${message}`);
    if (notify) new Notice(message);
  }
}
