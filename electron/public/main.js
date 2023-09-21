"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWindow = void 0;
const electron_1 = require("electron");
const path_1 = require("path");
const settings_1 = require("./settings");
electron_1.app.commandLine.appendSwitch('lang', 'ko-KR');
let warnWindow;
/**
 * 설정 변경
 */
electron_1.ipcMain.on('update-settings', (e, ...args) => {
    console.log(args);
    for (let key of Object.keys(args[0])) {
        settings_1.Settings[key] = args[0][key];
        console.log(`설정 업데이트: ${key} = ${args[0][key]}`);
    }
});
electron_1.ipcMain.on('save-settings', async (e, ...args) => {
    await (0, settings_1.saveSettings)();
});
electron_1.ipcMain.on('set-warn', (e, ...args) => {
    if (warnWindow) {
        warnWindow.webContents.send('set-warn', args[0]);
    }
});
electron_1.ipcMain.on('noti', (e, ...args) => {
    console.log(args);
    const title = args[0]["title"];
    const body = args[0]["body"];
    new electron_1.Notification({
        subtitle: "테스트",
        title: title,
        body: body
    }).show();
});
function createWarningWindow(win) {
    if (warnWindow) {
        return;
    }
    console.log('warnWin');
    warnWindow = new electron_1.BrowserWindow({
        focusable: false,
        parent: win,
        frame: false,
        transparent: true,
        minimizable: false,
        alwaysOnTop: true,
        maximizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    warnWindow.maximize();
    warnWindow.show();
    warnWindow.setMenuBarVisibility(false);
    warnWindow.setIgnoreMouseEvents(true);
    if (electron_1.app.isPackaged) {
        // 빌드된 환경
        warnWindow.loadURL(`file://${__dirname}/index.html#/warn`);
    }
    else {
        // 개발 환경
        warnWindow.loadURL(`http://localhost:3000#/warn`);
    }
}
async function createWindow() {
    const WIDTH = 250;
    const HEIGHT = 250;
    // 저장된 설정에서 마지막 위치 불러오기
    let POS_X = electron_1.screen.getPrimaryDisplay().workAreaSize.width - WIDTH;
    let POS_Y = 0;
    await (0, settings_1.loadSettings)();
    if (settings_1.Settings.position) {
        POS_X = settings_1.Settings.position[0];
        POS_Y = settings_1.Settings.position[1];
    }
    electron_1.app.setName("히유 IP 모니터링");
    electron_1.app.setAppUserModelId("히유 IP 모니터링");
    exports.mainWindow = new electron_1.BrowserWindow({
        width: WIDTH,
        height: HEIGHT,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        minimizable: false,
        x: POS_X,
        y: POS_Y,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: (0, path_1.join)(__dirname, "..", "..", "assets", "icons", "icon.ico")
    });
    exports.mainWindow.setMenuBarVisibility(false);
    if (electron_1.app.isPackaged) {
        // 빌드된 환경
        exports.mainWindow.loadFile((0, path_1.join)(__dirname, 'index.html'));
    }
    else {
        //mainWindow.webContents.openDevTools();
        // 개발 환경
        exports.mainWindow.loadURL(`http://localhost:3000`);
    }
    exports.mainWindow.webContents.addListener('did-finish-load', () => {
        createWarningWindow(exports.mainWindow);
    });
    exports.mainWindow.on('moved', async () => {
        await (0, settings_1.saveSettings)();
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('window-all-closed', async () => {
        electron_1.app.exit();
    });
});
