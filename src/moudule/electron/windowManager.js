import {BrowserWindow, ipcMain} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";
const path = require('path')

import {registerMainWindowMonitor, registerMonitor} from "./eventMonitor";
import {logger} from "../utils/logger";

const tag = "windowManager.js";

/**
 * 创建主窗口
 */
function createMainWindow() {
    windows.mainWindow = new BrowserWindow({
        hasShadow: false,                          // 窗口是否有阴影
        frame: false,                              // 设置为 false 时可以创建一个无边框窗口
        width: 1440,
        height: 800,
        resizable: false,                          // 窗口大小是否可调整
        movable: true,
        maximizable: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        windows.mainWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}index.html`).then(r => {});
        if (!process.env.IS_TEST) windows.mainWindow.webContents.openDevTools();
    } else {
        createProtocol('app');
        windows.mainWindow.loadURL('app://./index.html').then(r => {});
        windows.mainWindow.webContents.openDevTools();
    }

    windows.mainWindow.on('closed', () => {
        windows.mainWindow = null;
    });

    registerMainWindowMonitor(windows.mainWindow);
}

/**
 * 创建工作窗口（不显示窗口）
 */
function createWorkWindow() {
    windows.workWindow = new BrowserWindow({
        show: true,                                // 是否显示窗口
        webPreferences: {
            nodeIntegration: true,                 // 是否启用node集成，默认值是false，开启后将可以在渲染进程中使用nodejs模块
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });

    windows.workWindow.on('closed', () => {
       windows.workWindow = null;
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        windows.workWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}worker.html`).then(() => {});
        windows.workWindow.webContents.openDevTools();
    } else {
        windows.workWindow.loadURL('app://./worker.html');
        windows.workWindow.webContents.openDevTools();
    }
}

export const windows = {
    mainWindow: null,
    workWindow: null,
    createMainWindow,
    createWorkWindow,
}