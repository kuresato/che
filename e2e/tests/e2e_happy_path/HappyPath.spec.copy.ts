/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { e2eContainer } from '../../inversify.config';
import { CLASSES, TYPES } from '../../inversify.types';
import { Editor } from '../../pageobjects/ide/Editor';
import { Ide } from '../../pageobjects/ide/Ide';
import { QuickOpenContainer } from '../../pageobjects/ide/QuickOpenContainer';
import { ICheLoginPage } from '../../pageobjects/login/ICheLoginPage';
import { TestConstants } from '../../TestConstants';
import { DriverHelper } from '../../utils/DriverHelper';
import { GitHubUtils } from '../../utils/GitHub/GitHubUtils';

const driverHelper: DriverHelper = e2eContainer.get(CLASSES.DriverHelper);
const ide: Ide = e2eContainer.get(CLASSES.Ide);
const quickOpenContainer: QuickOpenContainer = e2eContainer.get(CLASSES.QuickOpenContainer);
const editor: Editor = e2eContainer.get(CLASSES.Editor);
const namespace: string = TestConstants.TS_SELENIUM_USERNAME;
const workspaceName: string = TestConstants.TS_SELENIUM_HAPPY_PATH_WORKSPACE_NAME;
const workspaceUrl: string = `${TestConstants.TS_SELENIUM_BASE_URL}/dashboard/#/ide/${namespace}/${workspaceName}`;
const loginPage: ICheLoginPage = e2eContainer.get<ICheLoginPage>(TYPES.CheLogin);
const gitHubUtils: GitHubUtils = e2eContainer.get<GitHubUtils>(CLASSES.GitHubUtils);

suite('Validation of workspace start', async () => {

    test('Open workspace', async () => {
        await driverHelper.navigateToUrl(workspaceUrl);
        await loginPage.login();
    });

    test('Wait workspace running state', async () => {
        await ide.waitWorkspaceAndIde(namespace, workspaceName);
        await driverHelper.getDriver().sleep(5000);
    });

    test('Wait until project is imported', async () => {
        await quickOpenContainer.invokeByHotKey();
        await quickOpenContainer.typeAndSelectSuggestion('SSH', 'SSH: generate key pair...');
        await ide.waitNotificationAndClickOnButton('Key pair successfully generated, do you want to view the public key', 'View');
        await editor.waitEditorOpened('Untitled-0');
        const generatedKey:string = await editor.getEditorVisibleText('Untitled-0');
        console.log('<<<<<<<<<<<<<<:'+ generatedKey)
        await gitHubUtils.addPublicSshKeyToUserAccount(TestConstants.TS_GITHUB_PERSONAL_ACCESS_TOKEN, 'test-SSH', generatedKey);
    });
});

