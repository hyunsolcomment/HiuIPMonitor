import { app, ipcMain, BrowserWindow,screen,Notification } from "electron";
import { join } from 'path';
import * as fs from 'fs/promises';
import { Settings, loadSettings, saveSettings } from "./settings";

app.commandLine.appendSwitch('lang', 'ko-KR');

export let mainWindow: BrowserWindow;
let warnWindow: BrowserWindow;

/**
 * 설정 변경
 */
ipcMain.on('update-settings', (e, ...args) => {
    console.log(args);
    for(let key of Object.keys(args[0])) {
        Settings[key] = args[0][key];
        console.log(`설정 업데이트: ${key} = ${args[0][key]}`);
    }
})

ipcMain.on('save-settings', async (e, ...args) => {
    await saveSettings();
})

ipcMain.on('set-warn', (e, ...args) => {
    if(warnWindow) {
        warnWindow.webContents.send('set-warn', args[0]);
    }
})

ipcMain.on('noti', (e, ...args) => {
    console.log(args);

    const title = args[0]["title"];
    const body  = args[0]["body"];

    new Notification({
        subtitle: "테스트",
        title: title,
        body: body
    }).show()

})

function createWarningWindow(win: BrowserWindow) {
    if(warnWindow) {
        return;
    }

    console.log('warnWin');
    warnWindow = new BrowserWindow({
        focusable:false,
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

    if(app.isPackaged) {

        // 빌드된 환경
        warnWindow.loadURL(`file://${__dirname}/index.html#/warn`);

    } else {
        
        // 개발 환경
        warnWindow.loadURL(`http://localhost:3000#/warn`);

    }

}

async function createWindow() {

    const WIDTH  = 250;
    const HEIGHT = 250;

    // 저장된 설정에서 마지막 위치 불러오기
    let POS_X = screen.getPrimaryDisplay().workAreaSize.width - WIDTH;
    let POS_Y = 0;

    await loadSettings();
    
    if(Settings.position) {
        POS_X  = Settings.position[0];
        POS_Y  = Settings.position[1];
    }

    app.setName("히유 IP 모니터링");
    app.setAppUserModelId("히유 IP 모니터링");

    mainWindow = new BrowserWindow({
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
        icon: join(__dirname, "..", "..", "assets", "icons","icon.ico")
    });

    mainWindow.setMenuBarVisibility(false);

    if(app.isPackaged) {

        // 빌드된 환경
        mainWindow.loadFile(join(__dirname,'index.html'));

    } else {

        //mainWindow.webContents.openDevTools();
        
        // 개발 환경
        mainWindow.loadURL(`http://localhost:3000`);
    }

    mainWindow.webContents.addListener('did-finish-load', () => {
        createWarningWindow(mainWindow);
    })

    mainWindow.on('moved', async () => {
        await saveSettings();
    })
}

app.whenReady().then(() => {
    createWindow();

    app.on('window-all-closed', async () => {
        app.exit();
    })
})