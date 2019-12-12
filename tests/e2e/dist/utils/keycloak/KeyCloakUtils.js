"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const axios_1 = __importDefault(require("axios"));
const TestConstants_1 = require("../../TestConstants");
const querystring_1 = __importDefault(require("querystring"));
let KeyCloakUtils = class KeyCloakUtils {
    /**
     * Get keycloak token with API
     */
    getBearerToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const keycloakEndpoint = yield axios_1.default.get(TestConstants_1.TestConstants.TS_SELENIUM_BASE_URL + '/api/keycloak/settings');
            const keycloakUrl = keycloakEndpoint.data['che.keycloak.token.endpoint'];
            const keycloakClientId = keycloakEndpoint.data['che.keycloak.client_id'];
            const params = {
                client_id: keycloakClientId,
                password: TestConstants_1.TestConstants.TS_SELENIUM_USERNAME,
                username: TestConstants_1.TestConstants.TS_SELENIUM_PASSWORD,
                grant_type: 'password'
            };
            const responseToObtainedBearerToken = yield axios_1.default.post(keycloakUrl, querystring_1.default.stringify(params));
            return TestConstants_1.TestConstants.TS_SELENIUM_MULTIUSER ? 'Bearer ' + responseToObtainedBearerToken.data.access_token : 'dummy_token';
        });
    }
    /**
     * Get keycloak token with javascript invocation for the current Webdriver sesion
     * Use carefully! In multiuser mode a user should be loggened in a Workspace
     * @param webdriverInstance current Webdriver instance
     */
    getAuthTokenFromBrowserSession(webdriverInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            yield webdriverInstance.switchTo().defaultContent();
            const obtainedToken = yield webdriverInstance.executeScript('return window._keycloak.token');
            return TestConstants_1.TestConstants.TS_SELENIUM_MULTIUSER ? 'Bearer ' + obtainedToken : 'dummy_token';
        });
    }
};
KeyCloakUtils = __decorate([
    inversify_1.injectable()
], KeyCloakUtils);
exports.KeyCloakUtils = KeyCloakUtils;
//# sourceMappingURL=KeyCloakUtils.js.map