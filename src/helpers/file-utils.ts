import { normalizePath, App } from "obsidian";

export class FileUtils {

  private readonly app: App;

  constructor(app: App) {
  	this.app = app;
  }

  getParentOfNormalized(normalizedPath: string) {
    let pathSplit = normalizedPath.split("/");
    return pathSplit.slice(0, pathSplit.length - 1).join("/");
  }

  async exists(file: string) {
    return await this.app.vault.adapter.exists(normalizePath(file));
  }

  async createFolders(normalizedPath: string) {
    let current = normalizedPath;
    while (current && !(await this.app.vault.adapter.exists(current))) {
      await this.app.vault.createFolder(current);
      current = this.getParentOfNormalized(current);
    }
  }

  async createIfNotExists(file: string, data: string) {
    const normalizedPath = normalizePath(file);
    if (!(await this.exists(normalizedPath))) {
      let folderPath = this.getParentOfNormalized(normalizedPath);
      await this.createFolders(folderPath);
      await this.app.vault.create(normalizedPath, data);
    }
  }
}
