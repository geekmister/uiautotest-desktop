import { app } from 'electron';
import path from "path";
import fs from "fs";

import {createMainWindow, windows} from "./windowManager";
import {logger, initLogger} from "../utils/logger";
import {tideviceConf} from "../command/tidevice/tidevice";

const tag = "application.js";
let settingFile = "";

/**
 * 注册生命周期
 */
function resigterAppLifeCycle() {
    logger.verbose(tag, "===== resigterAppLifeCycle() =====");

    app.on('ready', async () => {
        logger.verbose(tag, "app life cycle: ready");

        // 这里注释掉是因为会安装tools插件，需要屏蔽掉，有能力的话可以打开注释
        // if (isDevelopment && !process.env.IS_TEST) {
        //   try {
        //     await installVueDevtools();
        //   } catch (e) {
        //     console.error('Vue Devtools failed to install:', e.toString());
        //   }
        // }
        windows.createMainWindow();
        windows.createWorkWindow();
    });

    app.on('window-all-closed', async () => {
        logger.verbose(tag, "app life cycle: window-all-closed");

        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', async () => {
        logger.verbose(tag, "app life cycle: activate");

        if (windows.mainWindow === null) {
            createMainWindow();
        }
    });
}

/**
 * 重写Tidevice文件
 * @param inspectorPath
 */
function writeTidevice(inspectorPath) {
    logger.verbose(tag, "===== writeTidevice() =====");
    logger.debug(tag, "inspectorPath: ", inspectorPath);

    fs.readFile(inspectorPath + "/tidevice",
        (err, data) => {
            if(err != null) {
                logger.error(tag, "err: ", err);
                return;
            }

            // logger.debug(tag, "data: ", data);
            let str = data.toString('utf8');
            logger.debug(tag, "str: ", str);

            let endIndex = str.indexOf("\n");
            let firstLine = `#!${inspectorPath}/python3\n`;
            str = firstLine + str.slice(endIndex + 1, str.length);
            logger.debug(tag, "str: " + str);

            fs.writeFile(inspectorPath + "/tidevice", str, 'utf8', (err => {
                if(err) {
                    logger.error(tag, "tidevice文件写入失败，发生了异常，需要找开发者修复!");
                    app.quit();
                    return;
                }else {
                    logger.debug(tag, "tidevice文件写入成功!");
                }
            }));
        });
}

/**
 * 应用启动检查
 */
function inspect() {
    logger.verbose(tag, "===== fileInspect() =====");

    let userDataCatelog = app.getPath('userData');
    logger.debug(tag, `用户数据目录: ${userDataCatelog}`);

    /** 检查日志目录并初始化日志 */
    let logCatelog = path.join(userDataCatelog, "log");
    logger.debug(tag, `日志存储目录: ${logCatelog}`);
    let date = new Date;
    let time = date.toLocaleDateString();
    logger.debug(tag, "time: ", time);
    let name = time.replace("/", "").replace("/", "");
    initLogger(logCatelog, `${name}.log`);

    /** 检查偏好设置 */
    try{
        settingFile = path.join(userDataCatelog, 'setting.json');
        logger.debug(tag, `偏好设置文件: ${settingFile}`);

        fs.statSync(settingFile);
    }catch (e) {
        logger.error(tag, "settingFile文件不存在，正在创建settingFile文件...");

        let data = "{\n" +
            "  \"autoExec\": false,\n" +
            "  \"frameRate\": 200\n" +
            "}";

        fs.writeFile(settingFile, data, 'utf8', (err => {
            if(err) {
                logger.error(tag, "setting.json文件写入失败，发生了异常，需要找开发者修复!");
                app.quit();
                return;
            }else {
                logger.debug(tag, "setting.json文件写入成功!");
            }
        }));
    }

    /** 配置python解释器路径 */
    if(process.platform === 'darwin') {
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            writeTidevice("/Users/geekchief/Desktop/Work/Workspace/Geekkampong" +
                "/uiautotest/uiautotest-client/app/src/moudule/resources/environment/mac/bin");
        }else {
            writeTidevice(__dirname.replace("/app.asar", "")
                + '/extraResources/environment/mac/bin');
        }
    }
}

/**
 * 返回偏好设置文件
 * @return {string} 偏好设置文件
 */
export function getSettingFile() {
    return settingFile;
}

/**
 * @name getPathData
 * @desc 获取路径数据
 * @return data {object} 路径对象
 */
export function getPathData() {
    let data = {
        userData: app.getPath("userData")
    }

    logger.debug(tag, "userData:", data.userData);

    return data;
}

/**
 * 初始化应用
 */
export function init() {
    logger.verbose(tag, "===== init() =====");

    inspect();
    resigterAppLifeCycle();
}