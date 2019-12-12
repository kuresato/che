"use strict";
/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../../inversify.config");
const inversify_types_1 = require("../../inversify.types");
const TestConstants_1 = require("../../TestConstants");
const driverHelper = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.DriverHelper);
const ide = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.Ide);
const quickOpenContainer = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.QuickOpenContainer);
const editor = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.Editor);
const namespace = TestConstants_1.TestConstants.TS_SELENIUM_USERNAME;
const workspaceName = TestConstants_1.TestConstants.TS_SELENIUM_HAPPY_PATH_WORKSPACE_NAME;
const workspaceUrl = `${TestConstants_1.TestConstants.TS_SELENIUM_BASE_URL}/dashboard/#/ide/${namespace}/${workspaceName}`;
const loginPage = inversify_config_1.e2eContainer.get(inversify_types_1.TYPES.CheLogin);
const gitHubUtils = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.GitHubUtils);
const cheGitAPI = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.CheGitApi);
const keyCloakApi = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.KeyCloakUtils);
const openWorkspaceWidget = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.OpenWorkspaceWidget);
const projectTree = inversify_config_1.e2eContainer.get(inversify_types_1.CLASSES.ProjectTree);
suite('Validation of workspace start', () => __awaiter(this, void 0, void 0, function* () {
    test('Login into worksoace', () => __awaiter(this, void 0, void 0, function* () {
        yield driverHelper.navigateToUrl(workspaceUrl);
        yield loginPage.login();
        yield ide.waitWorkspaceAndIde(namespace, workspaceName);
        yield projectTree.openProjectTreeContainer();
    }));
    test('Wait until project is imported', () => __awaiter(this, void 0, void 0, function* () {
        yield quickOpenContainer.invokeByHotKey();
        yield quickOpenContainer.typeAndSelectSuggestion('SSH', 'SSH: generate key pair...');
        yield ide.waitNotificationAndClickOnButton('Key pair successfully generated, do you want to view the public key', 'View');
        yield editor.waitEditorOpened('Untitled-0');
        const token = yield keyCloakApi.getBearerToken();
        const publicSshKey = yield cheGitAPI.getPublicSshKey(token);
        editor.waitText('Untitled-0', 'ssh-rsa');
        //await gitHubUtils.addPublicSshKeyToUserAccount(TestConstants.TS_GITHUB_PERSONAL_ACCESS_TOKEN, 'test-SSH', publicSshKey);
        yield quickOpenContainer.invokeByHotKey();
        yield quickOpenContainer.typeAndSelectSuggestion('clone', 'Git: Clone');
        yield quickOpenContainer.typeAndSelectSuggestion('git@github.com:maxura/Spoon-Knife.git', "Repository URL (Press 'Enter' to confirm your input or 'Escape' to cancel)");
        openWorkspaceWidget.selectRootWorkspaceItemInDropDawn('/');
        openWorkspaceWidget.selectItemInTreeAndOpenWorkspace('/projects');
    }));
}));
//# sourceMappingURL=HappyPath.spec.copy.js.map