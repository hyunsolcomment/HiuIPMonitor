import * as fs from 'fs/promises';
import { mainWindow } from './main';

export const Settings = {
    position: [0,0],
    warnEnable: true,
    warnCountry: 'KR'
}

export async function saveSettings() {
    Settings.position = mainWindow.getPosition();

    await fs.writeFile(
        "settings.json", 
        JSON.stringify({
            position    : Settings.position,
            warnEnable  : Settings.warnEnable,
            warnCountry : Settings.warnCountry
        })
    );

    console.log("설정 저장");

    mainWindow.webContents.addListener('did-finish-load', () => {
        mainWindow.webContents.send('load-settings', Settings)
    })
}

export async function loadSettings() {
    try {
        await fs.access("settings.json");

        const settings = JSON.parse(
            await fs.readFile("settings.json", 'utf-8')
        );
    
        Settings.warnCountry = settings["warnCountry"] as string;
        Settings.warnEnable  = settings["warnEnable"] as boolean;
        Settings.position    = settings["position"] as number[];
        
    } catch {

    }
}