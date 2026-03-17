import { Octokit } from "@octokit/rest";

/**
 * Service for interacting with the GitHub REST API securely.
 */
export class GitHubService {
  /**
   * Octokit REST API client instance.
   */
  private readonly octokit: Octokit;

  /**
   * Initializes the GitHubService with the provided Personal Access Token.
   * @param token - The GitHub Personal Access Token used for authorization.
   */
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Retrieves all followers for the authenticated user using paginated API calls.
   * @returns A promise that resolves to an array of all your current follower usernames.
   */
  async getAllFollowers(): Promise<string[]> {
    const followers: string[] = [];
    let page = 1;

    while (true) {
      const response = await this.octokit.rest.users.listFollowersForAuthenticatedUser({
        per_page: 100,
        page,
      });

      if (response.data.length === 0) break;
      
      followers.push(...response.data.map((user) => user.login));
      page++;
    }

    return followers;
  }

  /**
   * Retrieves all users the authenticated user is following using paginated API calls.
   * @returns A promise that resolves to an array of all usernames you are currently following.
   */
  async getFollowing(): Promise<string[]> {
    const following: string[] = [];
    let page = 1;

    while (true) {
      // Using generic request to avoid potential type issues with rest client wrappers
      const response = await this.octokit.request("GET /user/following", {
        per_page: 100,
        page,
      });

      if (response.data.length === 0) break;

      following.push(...response.data.map((user: { login: string }) => user.login));
      page++;
    }

    return following;
  }

  /**
   * Follows a specific GitHub user by username.
   * @param username - The exact GitHub username to follow.
   * @returns A promise that resolves when the user has been followed successfully.
   */
  async followUser(username: string): Promise<void> {
    await this.octokit.rest.users.follow({ username });
  }

  /**
   * Unfollows a specific GitHub user by username.
   * @param username - The exact GitHub username to unfollow.
   * @returns A promise that resolves when the user has been unfollowed successfully.
   */
  async unfollowUser(username: string): Promise<void> {
    await this.octokit.rest.users.unfollow({ username });
  }
}
