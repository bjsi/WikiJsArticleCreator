import { App, Modal, Plugin, TextComponent, ButtonComponent} from 'obsidian';

export default class MyPlugin extends Plugin {

	async onload() {
		console.log('Loading WikiJsArticleCreator plugin');

		await this.loadSettings();

		// this.addRibbonIcon('dice', 'Sample Plugin', () => {
		// 	new Notice('This is a notice!');
		// });

		// this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'create-wiki-js-note',
			name: 'Create Wiki.js Note',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});
	}

	onunload() {
		console.log('Unloading WikiJsArticleCreator plugin');
	}

	async loadSettings() {
    }

	async saveSettings() {
	}
}

class SampleModal extends Modal {
    title = "";
    description = "";


	constructor(app: App) {
		super(app);
	}

	onOpen = () => {
		let {contentEl} = this;

        contentEl.appendText("Title: ");
        let inputTitleField = new TextComponent(contentEl).setPlaceholder("Title");
        contentEl.createEl("br");
        
        contentEl.appendText("Description: ");
        let inputDescriptionField = new TextComponent(contentEl).setPlaceholder("Description");
        contentEl.createEl("br");

        contentEl.appendText("Folder Path: ");
        let inputFolderField = new TextComponent(contentEl).setPlaceholder("Path");
        contentEl.createEl("br");
        
        contentEl.appendText("Tags: ");
        let inputTagsField = new TextComponent(contentEl).setPlaceholder("Tags");

        contentEl.createEl("br")

        contentEl.appendText("Published?: ");
        let inputPublishedField = new TextComponent(contentEl).setValue("true");
        contentEl.createEl("br");

		let inputButton = new ButtonComponent(contentEl)
		.setButtonText("Create Article")
		.onClick(async () => {
            let curtime = new Date(Date.now()).toISOString();
            let text = `---
title: ${inputTitleField.getValue()}
description: ${inputDescriptionField.getValue()}
published: ${inputPublishedField.getValue()}
date: ${curtime}
tags: ${inputTagsField.getValue()}
editor: undefined
dateCreated: ${curtime}
---`

            let fp = inputFolderField.getValue();
            if (!fp.endsWith('.md'))
                fp = fp + '.md';
            await this.app.vault.create(fp, text);
            await this.app.workspace.openLinkText(fp, '', false, { active: true  });

			this.close();
		});

		inputTitleField.inputEl.focus();
	}

	onClose() {
		let {contentEl} = this;
        		  
		contentEl.empty();
	}
}
