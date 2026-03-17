/**
 * Utility class for professional formatted console logging without emojis.
 */
export class Logger {
  /**
   * Logs an informational message.
   * @param message - The informational message to log.
   */
  static info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  /**
   * Logs a success message indicating an operation completed successfully.
   * @param message - The success message to log.
   */
  static success(message: string): void {
    console.log(`[SUCCESS] ${message}`);
  }

  /**
   * Logs a warning message when something unexpected but non-fatal occurs.
   * @param message - The warning message to log.
   */
  static warn(message: string): void {
    console.warn(`[WARNING] ${message}`);
  }

  /**
   * Logs an error message when a fatal or processing error occurs.
   * @param message - The error message to log.
   */
  static error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}
