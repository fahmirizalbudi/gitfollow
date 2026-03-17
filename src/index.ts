import * as path from "path";
import { config } from "./config/env";
import { Logger } from "./utils/logger";
import { FileStorage } from "./utils/fileStorage";
import { GitHubService } from "./services/github";

/**
 * Main application class that orchestrates the GitHub follower automation.
 */
class App {
  /**
   * GitHub service instance.
   */
  private readonly github: GitHubService;

  /**
   * File storage instance.
   */
  private readonly storage: FileStorage;

  /**
   * Indicates if the server is currently running.
   */
  private isRunning: boolean = false;

  /**
   * Initializes the application.
   */
  constructor() {
    if (!config.githubToken) {
      Logger.error("GITHUB_TOKEN is missing in the environment variables. Please check your .env file.");
      process.exit(1);
    }

    this.github = new GitHubService(config.githubToken);
    
    // Define the database file path relative to this script
    const dbPath = path.join(__dirname, "..", "followers_db.json");
    this.storage = new FileStorage(dbPath);

    this.setupGracefulShutdown();
  }

  /**
   * Sets up listeners for process signals to ensure graceful shutdown.
   */
  private setupGracefulShutdown(): void {
    const shutdown = (): void => {
      Logger.info("Shutdown signal received. Closing server...");
      this.isRunning = false;
      // Exit after a brief delay to allow pending logs to flush if any
      setTimeout(() => process.exit(0), 1000);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }

  /**
   * Performs a single check of followers and takes necessary actions.
   */
  private async performCheck(): Promise<void> {
    Logger.info("Fetching current followers and following lists from GitHub...");

    try {
      const currentFollowers = await this.github.getAllFollowers();
      const currentFollowing = await this.github.getFollowing();
      
      Logger.info(`Status: ${currentFollowers.length} followers, ${currentFollowing.length} following.`);

      if (!this.storage.exists()) {
        Logger.warn("Initial execution detected. Baseline established.");
        this.storage.write(currentFollowers);
        Logger.success("Database initialized. Automation will start on the next cycle.");
        return;
      }

      const previousFollowers = this.storage.read();
      
      // 1. Identification of new followers (to follow back)
      const newFollowers = currentFollowers.filter(user => !previousFollowers.includes(user));
      
      // 2. Identification of lost followers (who used to follow you)
      const lostFollowers = previousFollowers.filter(user => !currentFollowers.includes(user));

      // 3. Identification of "Non-Backtrackers" (People you follow who don't follow you back)
      // We check the entire following list against the entire current followers list.
      const nonBacktrackers = currentFollowing.filter(user => !currentFollowers.includes(user));

      if (newFollowers.length === 0 && lostFollowers.length === 0 && nonBacktrackers.length === 0) {
        Logger.info("No follower or following inconsistencies detected.");
      }

      // Action: Follow back new followers
      for (const user of newFollowers) {
        Logger.info(`New follower: @${user}. Automating follow back.`);
        try {
          await this.github.followUser(user);
          Logger.success(`Successfully followed @${user}.`);
        } catch (err: any) {
          Logger.error(`Failed to follow @${user}: ${err.message}`);
        }
      }

      // Action: Unfollow those who unfollowed you (reciprocity)
      for (const user of lostFollowers) {
        Logger.info(`User @${user} unfollowed you. Automating unfollow.`);
        try {
          await this.github.unfollowUser(user);
          Logger.success(`Successfully unfollowed @${user}.`);
        } catch (err: any) {
          if (err.message?.includes("Resource not accessible by personal access token")) {
             Logger.error(`Failed to unfollow @${user}: Your GitHub Token lacks the 'user:follow' scope! Please recreate your token with 'user:follow' permission.`);
          } else {
             Logger.error(`Failed to unfollow @${user}: ${err.message}`);
          }
        }
      }

      // Action: Unfollow non-backtrackers (Clean up following list)
      for (const user of nonBacktrackers) {
        Logger.info(`User @${user} does not follow you back. Automating unfollow.`);
        try {
          await this.github.unfollowUser(user);
          Logger.success(`Successfully unfollowed @${user}.`);
        } catch (err: any) {
          if (err.message?.includes("Resource not accessible by personal access token")) {
             Logger.error(`Failed to unfollow @${user}: Your GitHub Token lacks the 'user:follow' scope! Please recreate your token with 'user:follow' permission.`);
          } else {
             Logger.error(`Failed to unfollow @${user}: ${err.message}`);
          }
        }
      }

      // Persist the updated followers list for the next cycle
      if (newFollowers.length > 0 || lostFollowers.length > 0 || nonBacktrackers.length > 0) {
        this.storage.write(currentFollowers);
        Logger.success("Follower database updated.");
      }

    } catch (error: any) {
      Logger.error(`Error during check cycle: ${error.message}`);
    }
  }

  /**
   * Starts the continuous server mode.
   */
  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    Logger.info("GitHub Follower Server started.");
    Logger.info(`Checking every ${config.checkInterval / 1000} seconds.`);

    while (this.isRunning) {
      await this.performCheck();
      
      if (this.isRunning) {
        // Wait for the configured interval before the next check
        await new Promise(resolve => setTimeout(resolve, config.checkInterval));
      }
    }
  }
}

// Bootstrap the application as a server
const app = new App();
app.start();
