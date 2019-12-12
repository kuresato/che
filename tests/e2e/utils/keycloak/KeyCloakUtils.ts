import { injectable } from 'inversify';
import axios from 'axios';
import { TestConstants } from '../../TestConstants'
import querystring from 'querystring';
import { ThenableWebDriver } from 'selenium-webdriver';
@injectable()
export class KeyCloakUtils {

    /**
     * Get keycloak token with API
     */
    async getBearerToken(): Promise<string> {
        const keycloakEndpoint = await axios.get(TestConstants.TS_SELENIUM_BASE_URL + '/api/keycloak/settings');
        const keycloakUrl = keycloakEndpoint.data['che.keycloak.token.endpoint'];
        const keycloakClientId = keycloakEndpoint.data['che.keycloak.client_id'];
        const params = {
            client_id: keycloakClientId,
            password: TestConstants.TS_SELENIUM_USERNAME,
            username: TestConstants.TS_SELENIUM_PASSWORD,
            grant_type: 'password'
        };
        const responseToObtainedBearerToken = await axios.post(keycloakUrl, querystring.stringify(params));
        return TestConstants.TS_SELENIUM_MULTIUSER ? 'Bearer ' + responseToObtainedBearerToken.data.access_token : 'dummy_token';
    }

    /**
     * Get keycloak token with javascript invocation for the current Webdriver sesion
     * Use carefully! In multiuser mode a user should be loggened in a Workspace
     * @param webdriverInstance current Webdriver instance
     */
    async getAuthTokenFromBrowserSession(webdriverInstance: ThenableWebDriver): Promise<string> {
        await webdriverInstance.switchTo().defaultContent();
        const obtainedToken: string = await webdriverInstance.executeScript('return window._keycloak.token');
        return TestConstants.TS_SELENIUM_MULTIUSER ? 'Bearer ' + obtainedToken : 'dummy_token';
    }

}
