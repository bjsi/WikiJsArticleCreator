import { Plugin } from "obsidian";
import { FileUtils } from "./helpers/file-utils";
import { LogTo } from "./logger";
import { DefaultSettings, Settings } from "./settings";
import { CreateNoteModal } from "./views/create-note-modal";
import { SettingsTab } from "./views/settings-tab";

export default class WikiJsUtils extends Plugin {
  public settings: Settings;
  public readonly files: FileUtils = new FileUtils(this.app);

  async onload() {
    LogTo.Debug("Loading...");
    await this.loadConfig();
    this.addSettingTab(new SettingsTab(this.app, this));
    this.registerCommands();
  }

  async loadConfig() {
    this.settings = this.settings = Object.assign(
      {},
      DefaultSettings,
      await this.loadData()
    );
  }

  generateCommands() {
    return this.settings.Folders.map((folder) => {
      return {
        id: `create-${folder.toLowerCase()}-wiki-js-note`,
        name: `Create ${folder} Note`,
        callback: () => new CreateNoteModal(this, folder).open(),
        hotkeys: [],
      };
    });
  }

  registerCommands() {
    this.generateCommands().forEach((c) => this.addCommand(c));
  }

  onunload() {
    LogTo.Debug("Unloading...");
  }
}
