import * as fs from "fs";

/**
 * Handles reading from and writing to the local file system
 * to persist the followers list state.
 */
export class FileStorage {
  /**
   * The absolute path to the JSON database file.
   */
  private readonly filePath: string;

  /**
   * Initializes the FileStorage with a specific file path.
   * @param filePath - The absolute or relative path to the JSON storage file.
   */
  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Checks if the storage file exists on the disk.
   * @returns A boolean indicating whether the file exists.
   */
  exists(): boolean {
    return fs.existsSync(this.filePath);
  }

  /**
   * Reads the followers list from the storage file.
   * @returns An array of GitHub usernames. If the file is unreadable, returns an empty array.
   */
  read(): string[] {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(data) as string[];
    } catch (error) {
      return [];
    }
  }

  /**
   * Writes the updated followers list back into the storage file.
   * @param followers - An array of current GitHub usernames to save.
   */
  write(followers: string[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(followers, null, 2));
  }
}
