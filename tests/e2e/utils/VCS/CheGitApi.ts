import { injectable, inject } from 'inversify';
import { TestConstants } from '../../TestConstants';
import { CLASSES } from '../../inversify.types';
import { KeyCloakUtils } from '../../utils/keycloak/KeyCloakUtils';
import axios from 'axios';

@injectable()
export class CheGitApi {

  constructor(@inject(CLASSES.KeyCloakUtils) private readonly keyCloak: KeyCloakUtils) { }
  private static readonly GIT_API_ENTRIPOINT_URL = TestConstants.TS_SELENIUM_BASE_URL + '/api/ssh/vcs';
  

  async getPublicSshKey(bearerToken?: string): Promise<string> {
    const headerParams = {headers:  {'Authorization': bearerToken}} ;
    const responce = await axios.get(CheGitApi.GIT_API_ENTRIPOINT_URL, headerParams);
    return responce.data[0].publicKey;
  }

}
