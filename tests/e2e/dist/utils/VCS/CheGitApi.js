"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var CheGitApi_1;
"use strict";
const inversify_1 = require("inversify");
const TestConstants_1 = require("../../TestConstants");
const inversify_types_1 = require("../../inversify.types");
const KeyCloakUtils_1 = require("../../utils/keycloak/KeyCloakUtils");
const axios_1 = __importDefault(require("axios"));
let CheGitApi = CheGitApi_1 = class CheGitApi {
    constructor(keyCloak) {
        this.keyCloak = keyCloak;
    }
    getPublicSshKey(bearerToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerParams = { headers: { 'Authorization': bearerToken } };
            const responce = yield axios_1.default.get(CheGitApi_1.GIT_API_ENTRIPOINT_URL, headerParams);
            return responce.data[0].publicKey;
        });
    }
};
CheGitApi.GIT_API_ENTRIPOINT_URL = TestConstants_1.TestConstants.TS_SELENIUM_BASE_URL + '/api/ssh/vcs';
CheGitApi = CheGitApi_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(inversify_types_1.CLASSES.KeyCloakUtils)),
    __metadata("design:paramtypes", [KeyCloakUtils_1.KeyCloakUtils])
], CheGitApi);
exports.CheGitApi = CheGitApi;
//# sourceMappingURL=CheGitApi.js.map