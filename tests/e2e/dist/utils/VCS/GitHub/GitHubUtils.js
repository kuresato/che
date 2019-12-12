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
var GitHubUtils_1;
"use strict";
const inversify_1 = require("inversify");
const axios_1 = __importDefault(require("axios"));
let GitHubUtils = GitHubUtils_1 = class GitHubUtils {
    addPublicSshKeyToUserAccount(authToken, title, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitHubApiSshURL = GitHubUtils_1.GITHUB_API_ENTRIPOINT_URL + 'user/keys';
            const authHeader = { headers: { 'Authorization': 'token ' + authToken, 'Content-Type': 'application/json' } };
            const data = {
                title: `${title}`,
                key: `${key}`
            };
            yield console.log('<<<<<<<<<<' + JSON.stringify(authHeader));
            try {
                yield axios_1.default.post(gitHubApiSshURL, JSON.stringify(data), authHeader);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
};
GitHubUtils.GITHUB_API_ENTRIPOINT_URL = 'https://api.github.com/';
GitHubUtils = GitHubUtils_1 = __decorate([
    inversify_1.injectable()
], GitHubUtils);
exports.GitHubUtils = GitHubUtils;
//# sourceMappingURL=GitHubUtils.js.map