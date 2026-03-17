import * as dotenv from "dotenv";

dotenv.config();

/**
 * Configuration object containing environment variables.
 */
export const config = {
  /**
   * GitHub Personal Access Token used for API authentication.
   */
  githubToken: process.env.GITHUB_TOKEN || "",

  /**
   * Interval in milliseconds for checking follower changes.
   * Defaults to 1 minute (60,000ms).
   */
  checkInterval: parseInt(process.env.CHECK_INTERVAL || "60000", 10),
};
