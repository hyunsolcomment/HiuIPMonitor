"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSettings = exports.saveSettings = exports.Settings = void 0;
const fs = require("fs/promises");
const main_1 = require("./main");
exports.Settings = {
    position: undefined,
    warnEnable: true,
    warnCountry: 'KR'
};
async function saveSettings() {
    exports.Settings.position = main_1.mainWindow.getPosition();
    await fs.writeFile("settings.json", JSON.stringify({
        position: exports.Settings.position,
        warnEnable: exports.Settings.warnEnable,
        warnCountry: exports.Settings.warnCountry
    }));
    console.log("설정 저장");
    main_1.mainWindow.webContents.addListener('did-finish-load', () => {
        main_1.mainWindow.webContents.send('load-settings', exports.Settings);
    });
}
exports.saveSettings = saveSettings;
async function loadSettings() {
    try {
        await fs.access("settings.json");
        const settings = JSON.parse(await fs.readFile("settings.json", 'utf-8'));
        exports.Settings.warnCountry = settings["warnCountry"];
        exports.Settings.warnEnable = settings["warnEnable"];
        exports.Settings.position = settings["position"];
    }
    catch {
    }
}
exports.loadSettings = loadSettings;
