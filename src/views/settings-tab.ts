import {
  PluginSettingTab,
  App,
  Setting,
  debounce,
} from "obsidian";
import { LogTo } from "src/logger";
import WikiJsUtils from "../main";
import IW from "../main";

export class SettingsTab extends PluginSettingTab {

  private readonly plugin: WikiJsUtils;

  constructor(app: App, plugin: IW) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const settings = this.plugin.settings;
    containerEl.empty();

    containerEl.createEl("h3", { text: "Wiki.js Utils Settings" });

    //
    // Folders
    new Setting(containerEl)
    	.setName("Folders")
	.setDesc("Newline separated list of folders which will be used to generate note adding commands.")
	.addTextArea((comp) => {
		comp.setPlaceholder("Example:\nfolder1\nfolder2\nfolder3")
		comp.setValue(settings.Folders.join("\n"))
		    .onChange(debounce(value => {
			const folders = String(value)
				?.trim()
				?.split(/\r?\n/)
				?.filter(s => s != null && s.length > 0)
				?.map(s => s.trim())
				?.reduce((acc, x) => acc.add(x), new Set<string>()) || new Set<string>();
			LogTo.Debug("Remember to reload to register new commands!", true);
			settings.Folders = Array.from(folders);
			LogTo.Debug("Setting folders to: " + settings.Folders.toString());
			this.plugin.saveData(settings);
		    }, 2000, true)
	)})
  }
}
