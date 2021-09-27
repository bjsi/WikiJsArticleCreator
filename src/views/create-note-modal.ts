import {
  ButtonComponent,
  normalizePath,
  TextComponent,
  ToggleComponent,
} from "obsidian";
import { LogTo } from "src/logger";
import WikiJsUtils from "src/main";
import { ModalBase } from "./modal-base";
import "../helpers/str-utils.ts";
import sanitize from "sanitize-filename";

export class CreateNoteModal extends ModalBase {
  private readonly folder: string;
  private titleText: TextComponent;
  private descriptionText: TextComponent;
  private pathText: TextComponent;
  private tagsText: TextComponent;
  private publishedToggle: ToggleComponent;

  constructor(plugin: WikiJsUtils, folder: string) {
    super(plugin);
    this.folder = folder;
  }

  async onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h3", { text: "Create Wiki.js Note" });

    //
    // Title
    contentEl.appendText("Title: ");
    this.titleText = new TextComponent(contentEl)
      .setPlaceholder("Title")
      .onChange((s) => this.updateNotePath(s));
    contentEl.createEl("br");

    this.titleText.inputEl.focus();
    this.titleText.inputEl.select();

    //
    // Description
    contentEl.appendText("Description: ");
    this.descriptionText = new TextComponent(contentEl).setPlaceholder(
      "Describe the content"
    );
    contentEl.createEl("br");

    //
    // Note Path
    contentEl.appendText("Path: ");
    this.pathText = new TextComponent(contentEl)
      .setPlaceholder("Example: folder/file")
      .setValue(this.folder + "/");
    contentEl.createEl("br");

    //
    // Tags
    contentEl.appendText("Tags: ");
    this.tagsText = new TextComponent(contentEl).setPlaceholder(
      "Example: tag1,tag2"
    );
    contentEl.createEl("br");

    //
    // Published
    contentEl.appendText("Published: ");
    this.publishedToggle = new ToggleComponent(contentEl).setValue(false);
    contentEl.createEl("br");

    new ButtonComponent(contentEl).setButtonText("Create").onClick(async () => {
      await this.add(false);
      this.close();
    });

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.contentEl.addEventListener("keydown", async (ev) => {
      const newLeaf = ev.ctrlKey;
      if (ev.key === "Enter") {
        await this.add(newLeaf);
        this.close();
      }
    });
  }

  formatYamlMetadata() {
    const date = new Date(Date.now()).toISOString();
    const tags = this.tagsText
      .getValue()
      .split(",")
      .map((s) => s.trim());
    return `---
title: ${this.titleText.getValue()}
description: ${this.descriptionText.getValue()}
published: ${this.publishedToggle.getValue().toString()}
date: ${date}
tags: ${tags.join(",")}
editor: undefined
dateCreated: ${date}
aliases: ["${this.titleText.getValue()}", "${this.titleText
      .getValue()
      .toLowerCase()}"]
---`;
  }

  updateNotePath(value: string) {
    const name = value.replace(/\s+/g, "");
    this.pathText.setValue(
      normalizePath([this.folder, sanitize(name)].join("/"))
    );
  }

  async add(newLeaf: boolean) {
    const fp = this.pathText.getValue().withExtension(".md");
    if (await this.plugin.files.exists(fp)) {
      LogTo.Debug(`Note: ${fp} already exists!`, true);
      return;
    }
    await this.plugin.files.createIfNotExists(fp, this.formatYamlMetadata());
    await this.app.workspace.openLinkText(fp, "", newLeaf);
  }
}
