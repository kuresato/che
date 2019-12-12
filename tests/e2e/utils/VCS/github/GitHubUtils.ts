import { injectable } from 'inversify';
import axios from 'axios';

@injectable()
export class GitHubUtils {
  private static readonly GITHUB_API_ENTRIPOINT_URL = 'https://api.github.com/';

  public async addPublicSshKeyToUserAccount(authToken: string, title: string, key: string) {
    const gitHubApiSshURL: string = GitHubUtils.GITHUB_API_ENTRIPOINT_URL + 'user/keys';
    const authHeader = { headers: { 'Authorization': 'token ' + authToken, 'Content-Type': 'application/json' } };
    const data = {
      title: `${title}`,
      key: `${key}`
    };
    await console.log('<<<<<<<<<<' + JSON.stringify(authHeader));
    try {    await axios.post(gitHubApiSshURL, JSON.stringify(data), authHeader); } catch (error) {
       console.error(error);
    }
  }
}
