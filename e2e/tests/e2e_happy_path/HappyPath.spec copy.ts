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
import { DriverHelper } from '../../utils/DriverHelper';
import { TYPES, CLASSES } from '../../inversify.types';
import { Ide, RightToolbarButton } from '../../pageobjects/ide/Ide';
import { ProjectTree } from '../../pageobjects/ide/ProjectTree';
import { TopMenu } from '../../pageobjects/ide/TopMenu';
import { QuickOpenContainer } from '../../pageobjects/ide/QuickOpenContainer';
import { Editor } from '../../pageobjects/ide/Editor';
import { PreviewWidget } from '../../pageobjects/ide/PreviewWidget';
import { TestConstants } from '../../TestConstants';
import { RightToolbar } from '../../pageobjects/ide/RightToolbar';
import { By, Key, error } from 'selenium-webdriver';
import { DebugView } from '../../pageobjects/ide/DebugView';
import { WarningDialog } from '../../pageobjects/ide/WarningDialog';
import { Terminal } from '../../pageobjects/ide/Terminal';
import { ICheLoginPage } from '../../pageobjects/login/ICheLoginPage';
import * as fs from 'fs';
import { ContextMenu } from '../../pageobjects/ide/ContextMenu';

const driverHelper: DriverHelper = e2eContainer.get(CLASSES.DriverHelper);
const ide: Ide = e2eContainer.get(CLASSES.Ide);
const projectTree: ProjectTree = e2eContainer.get(CLASSES.ProjectTree);
const topMenu: TopMenu = e2eContainer.get(CLASSES.TopMenu);
const quickOpenContainer: QuickOpenContainer = e2eContainer.get(CLASSES.QuickOpenContainer);
const editor: Editor = e2eContainer.get(CLASSES.Editor);
const contextMenu: ContextMenu = e2eContainer.get(CLASSES.ContextMenu);
const previewWidget: PreviewWidget = e2eContainer.get(CLASSES.PreviewWidget);
const rightToolbar: RightToolbar = e2eContainer.get(CLASSES.RightToolbar);
const terminal: Terminal = e2eContainer.get(CLASSES.Terminal);
const debugView: DebugView = e2eContainer.get(CLASSES.DebugView);
const warningDialog: WarningDialog = e2eContainer.get(CLASSES.WarningDialog);
const projectName: string = 'petclinic';
const namespace: string = TestConstants.TS_SELENIUM_USERNAME;
const workspaceName: string = TestConstants.TS_SELENIUM_HAPPY_PATH_WORKSPACE_NAME;
const workspaceUrl: string = `${TestConstants.TS_SELENIUM_BASE_URL}/dashboard/#/ide/${namespace}/${workspaceName}`;
const pathToJavaFolder: string = `${projectName}/src/main/java/org/springframework/samples/petclinic`;
const pathToChangedJavaFileFolder: string = `${projectName}/src/main/java/org/springframework/samples/petclinic/system`;
const classPathFilename: string = '.classpath';
const javaFileName: string = 'PetClinicApplication.java';
const changedJavaFileName: string = 'CrashController.java';
const textForErrorMessageChange: string = 'HHHHHHHHHHHHH';
const codeNavigationClassName: string = 'SpringApplication.class';
const pathToYamlFolder: string = projectName;
const yamlFileName: string = 'devfile.yaml';
const loginPage: ICheLoginPage = e2eContainer.get<ICheLoginPage>(TYPES.CheLogin);

const SpringAppLocators = {
    springTitleLocator: By.xpath('//div[@class=\'container-fluid\']//h2[text()=\'Welcome\']'),
    springMenuButtonLocator: By.css('button[data-target=\'#main-navbar\']'),
    springErrorButtonLocator: By.xpath('//div[@id=\'main-navbar\']//span[text()=\'Error\']'),
    springErrorMessageLocator: By.xpath('//p[text()=\'Expected: controller used to ' +
        `showcase what happens when an exception is thrown${textForErrorMessageChange}\']`)
};


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
        await quickOpenContainer.type('SSH')
        await quickOpenContainer.typeAndSelectSuggestion('SSH','SSH: generate key pair...');
        await ide.waitNotificationAndClickOnButton('Key pair successfully generated, do you want to view the public key', 'View')
        await editor.waitEditorOpened()
    });
});






async function checkErrorMessageInApplicationController() {
    await previewWidget.waitAndSwitchToWidgetFrame();
    await previewWidget.waitAndClick(SpringAppLocators.springMenuButtonLocator);
    await previewWidget.waitAndClick(SpringAppLocators.springErrorButtonLocator);

    try {
        await previewWidget.waitVisibility(SpringAppLocators.springErrorMessageLocator);
    } catch (err) {

        await driverHelper.getDriver().switchTo().defaultContent();
        await ide.waitAndSwitchToIdeFrame();

        await previewWidget.waitAndSwitchToWidgetFrame();
        await previewWidget.waitVisibility(SpringAppLocators.springErrorMessageLocator);
    }


    await driverHelper.getDriver().switchTo().defaultContent();
    await ide.waitAndSwitchToIdeFrame();
}

async function runTask(task: string) {
    await topMenu.selectOption('Terminal', 'Run Task...');
    try {
        await quickOpenContainer.waitContainer();
    } catch (err) {
        if (err instanceof error.TimeoutError) {
            console.log(`After clicking to the "Terminal" -> "Run Task ..." the "Quick Open Container" has not been displayed, one more try`);

            await topMenu.selectOption('Terminal', 'Run Task...');
            await quickOpenContainer.waitContainer();
        }
    }

    await quickOpenContainer.clickOnContainerItem(task);
    await quickOpenContainer.clickOnContainerItem('Continue without scanning the task output');
}

async function checkCodeNavigationWithContextMenu() {
    await contextMenu.invokeContextMenuOnActiveElementWithKeys();
    await contextMenu.waitContextMenuAndClickOnItem('Go to Definition');
    console.log('Known isuue https://github.com/eclipse/che/issues/14520.');
}

// sometimes under high loading the first click can be failed
async function isureClickOnDebugMenu() {
    try { await topMenu.selectOption('Debug', 'Open Configurations'); } catch (e) {
        console.log(`After clicking to the Debug top menu the menu has been not opened, try to click again...`);
        await topMenu.selectOption('Debug', 'Open Configurations');
    }
}

async function checkJavaPathCompletion() {
    if (await ide.isNotificationPresent('Classpath is incomplete. Only syntax errors will be reported')) {
        const classpathText: string = fs.readFileSync('./files/happy-path/petclinic-classpath.txt', 'utf8');
        const workaroundReportText: string = '\n############################## \n\n' +
            'Known issue: https://github.com/eclipse/che/issues/13427 \n' +
            '\"Java LS \"Classpath is incomplete\" warning when loading petclinic\" \n' +
            '\".classpath\" will be configured with next settings: \n\n' +
            classpathText + '\n' +
            '############################## \n';

        console.log(workaroundReportText);

        await projectTree.expandPathAndOpenFile(projectName, classPathFilename);
        await editor.waitEditorAvailable(classPathFilename);
        await editor.type(classPathFilename, Key.chord(Key.CONTROL, 'a'), 1);
        await editor.performKeyCombination(classPathFilename, Key.DELETE);
        await editor.type(classPathFilename, classpathText, 1);
        await editor.waitTabWithSavedStatus(classPathFilename);
    }
}

