import { Modal } from "obsidian";
import WikiJsUtils from "src/main";

export abstract class ModalBase extends Modal {
  protected readonly plugin: WikiJsUtils;

  constructor(plugin: WikiJsUtils) {
    super(plugin.app);
    this.plugin = plugin;
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
