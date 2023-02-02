import {ipcMain,app} from 'electron';
const net = require("net");
const fs = require("fs");
import IP from 'ip';

import {logger} from "../utils/logger";
import {bootstrap, stop} from "../server/main";
import {startWda} from "../command/tidevice/xctest";
import {applist} from "../command/tidevice/applist";
import {install} from "../command/tidevice/install";
import {killProcessByPid} from "../command/system/electronCmd";
import {heartBeat} from "../../api/operationLinks";
import {getiOSList} from '../command/tidevice/list'
import {getDeviceInfo} from '../command/tidevice/device'
import {addIphone} from '../store/store'
import {windows} from "./windowManager";
import {getSettingFile, getPathData} from "./application";

// 日志标签
const tag = "eventMonitor.js";

// 定义事件类型
export const eventChannel = {
    oneKeyLaunch: "oneKeyLaunch",
    oneKeyClose: "oneKeyClose",
    oneKeyReboot: "oneKeyReboot",
    oneKeyLaunchResult: "oneKeyLaunchResult",
    oneKeyCloseResult: "oneKeyCloseResult",
    oneKeyRebootResult: "oneKeyRebootResult",
    closeClient: "closeClient",
    lanuchHeartBeatTask: "lanuchHeartBeatTask",
    stopHeartBeatTask: "stopHeartBeatTask",
    confirmTask: "confirmTask",
    lanuchTask: "lanuchTask"
}

/**
* @name: listenOneKeylaunch
* @Description: 监听一键启动事件
* @Param: window <BroswerWindow> 窗口
* @Return:
* @Author: geekmister
* @Date: 2021/9/22
*/
function listenOneKeylaunch(window) {
    logger.verbose(tag, "===== listenOneKeylaunch() =====");

    ipcMain.on(eventChannel.oneKeyLaunch, (event, args) => {
        logger.info(tag, `receive message: ${eventChannel.oneKeyLaunch}`);

        // 声明结果对象
        let result = {
            status: "SUCCESS",
            message: "",
            iphoneList: [],
            wdaPid: 0,
        };

        // 启动连接
        getiOSList((error, stdout, stderr) => {

            if (error != null) {
                result.status = "FAILED";
                result.message = error;
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                return;
            }

            if (stderr != "") {
                result.status = "FAILED";
                result.message = stderr;
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                return;
            }

            if (stdout == "") {
                result.status = "FAILED";
                result.message = "当前未连接iPhone，请先用USB连接设备！";
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                return;
            }

            let textArr = stdout.split("\n");
            if(textArr[textArr.length] == undefined) {
                let textArrLength = textArr.length;
                textArr.length = textArrLength - 1;
            }
            logger.info(tag, "textArr: " + textArr);

            for (let i = 0; i < textArr.length; i++) {
                let textArrItem = textArr[i];
                let itemArr = textArrItem.split(" ");

                let iphone = {
                    udid: itemArr[0],
                    name: itemArr[1],
                    connectionType: itemArr[2],
                    status: "已连接",
                    ip: "",
                }
                result.iphoneList.push(iphone);
            }
            result.message = "Connection Success!";
            window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));

            // 启动Server
            const server = net.createServer(() => {});
            server.listen(port, () => {});

            server.on('listening', function () {
                server.close();
                logger.info(tag, 'The port【' + port + '】 is available.');

                bootstrap();
                result.message = "Server Success!";
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));

                applist((error, stdout, stderr) => {
                    if (error != null) {
                        result.status = "FAILED";
                        result.message = error;
                        window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                        return;
                    }

                    if (stderr != "") {
                        result.status = "FAILED";
                        result.message = stderr;
                        window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                        return;
                    }

                    if (stdout == "") {
                        result.status = "FAILED";
                        result.message = "未知错误，请重新连接！";
                        window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                        return;
                    }

                    let appListStr = new String(stdout);
                    if(appListStr.indexOf("com.facebook.WebDriverAgentRunner.xctrunner") > -1) {
                        // 启动WDA
                        startWda(
                            (data) => {
                            },
                            (data) => {
                                let dataStr = new String(data);
                                // logger.info(tag, "dataStr:", dataStr.toString());

                                if(result.iphoneList[0].ip == "") {
                                    let beginIndex = dataStr.indexOf("ServerURLHere->") + 15;
                                    let endIndex = dataStr.indexOf("<-ServerURLHere");
                                    if(endIndex > -1) {
                                        // todo 先满足测试，这里有个bug，先用假ip测试
                                        result.iphoneList[0].ip = dataStr.substring(beginIndex, endIndex);
                                        // result.iphoneList[0].ip = "http://172.20.54.152:8100";
                                        logger.debug(tag, "ip: " + result.iphoneList[0].ip);
                                        result.message = "WDA Success!";
                                        window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                                    }
                                }
                            },
                            (code) => {
                            },
                            (pid) => {
                                result.wdaPid = pid;
                            },
                            result.iphoneList[0].udid, true);
                    }else {
                        logger.debug(tag, `path: ${app.getAppPath()}`);
                        install((error, stdout, stderr) => {
                            if (error != null) {
                                result.status = "FAILED";
                                result.message = error;
                                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                                return;
                            }

                            if (stderr != "") {
                                result.status = "FAILED";
                                result.message = stderr;
                                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                                return;
                            }

                            if (stdout == "") {
                                result.status = "FAILED";
                                result.message = "未知错误，请重新连接！";
                                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                                return;
                            }

                            // 启动WDA
                            startWda((data) => {},
                                (data) => {
                                    let dataStr = new String(data);

                                    if(result.iphoneList[0].ip == "") {
                                        let beginIndex = dataStr.indexOf("ServerURLHere->") + 15;
                                        let endIndex = dataStr.indexOf("<-ServerURLHere");
                                        if(endIndex > -1) {
                                            result.iphoneList[0].ip = dataStr.substring(beginIndex, endIndex);
                                            logger.debug(tag, "ip: " + result.iphoneList[0].ip);
                                            result.message = "WDA Success!";
                                            window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                                        }
                                    }
                                },
                                (code) => {
                                },
                                (pid) => {
                                    result.wdaPid = pid;
                                },
                                result.iphoneList[0].udid, true);
                        }, result.iphoneList[0].udid, `${process.cwd()}/src/moudule/resources/WDA.ipa`);
                    }
                }, result.iphoneList[0].udid);
            });

            server.on('error', function (err) {
                if (err.code === 'EADDRINUSE') {
                    logger.info(tag, 'The port【' + port + '】 is occupied, please change other port.');
                    result.status = "FAILED";
                    result.message = `端口号: ${port}，请先关闭占用${port}端口号的进程再重新启动！`;
                    window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                    return;
                }
            });
        });
    });
}

/**
* @name: listenOneKeyClose
* @Description: 监听一键关闭事件
* @Param: window <BroswerWindow> 窗口
* @Return:
* @Author: geekmister
* @Date: 2021/9/27
*/
function listenOneKeyClose(window) {
    logger.verbose(tag, "===== listenOneKeyClose() =====");

    ipcMain.on(eventChannel.oneKeyClose, (event, args) => {
        logger.info(tag, `receive message: ${eventChannel.oneKeyClose}`);

        let data = JSON.parse(args);
        logger.info(tag, "data: " + data.toString());

        // 声明结果对象
        let result = {
            status: "SUCCESS",
            message: "一键关闭成功！",
        };

        if(data.wdaPid != 0) {
            // 停止WDA
            killProcessByPid((error, stdout, stderr) => {
                if(error != null) {
                    result.status = "FAILED";
                    result.message = error;
                    window.webContents.send(eventChannel.oneKeyCloseResult, JSON.stringify(result));
                    return;
                }

                if(stderr != "") {
                    result.status = "FAILED";
                    result.message = stderr;
                    window.webContents.send(eventChannel.oneKeyCloseResult, JSON.stringify(result));
                    return;
                }
            }, data.wdaPid);
        }

        // 停止内置Server
        stop();

        window.webContents.send(eventChannel.oneKeyCloseResult, JSON.stringify(result));
    });
}

/**
* @name: listenCloseClient
* @Description: 监听关闭客户端事件
* @Param: window <BroswerWindow> 窗口
* @Return:
* @Author: geekmister
* @Date: 2021/10/9
*/
function listenCloseClient(window) {
    logger.verbose(tag, "===== listenCloseClient() =====");

    ipcMain.on(eventChannel.closeClient, (event, args) => {
        logger.info(tag, `receive message: ${eventChannel.closeClient}`);

        let pid = process.pid;
        logger.debug(tag, "pid: " + pid);

        killProcessByPid((error, stdout, stderr) => {

        }, pid);
    });

}

/**
* @name: listenOneKeyReboot
* @Description: 监听一键重启事件
* @Param:
 * window <BroswerWindow> 窗口
* @Return:
* @Author: geekmister
* @Date: 2021/9/27
*/
function listenOneKeyReboot(window) {
    logger.verbose(tag, "===== listenOneKeyReboot() =====");

    ipcMain.on(eventChannel.oneKeyReboot, (event, args) => {
        logger.info(tag, `receive message: ${eventChannel.oneKeyReboot}`);

        // 声明结果对象
        let result = {
            status: "SUCCESS",
            message: "",
            iphoneList: [],
            wdaPid: 0,
        };

        let data = JSON.parse(args);
        logger.info(tag, "data: " + data.toString());

        // 停止WDA
        if(data.wdaPid != 0) {
            killProcessByPid((error, stdout, stderr) => {}, data.wdaPid);
        }

        // 停止内置Server
        stop();

        // 一键启动

        // 启动连接
        getiOSList((error, stdout, stderr) => {

            if (error != null) {
                result.status = "FAILED";
                result.message = error;
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                return;
            }

            if (stderr != "") {
                result.status = "FAILED";
                result.message = stderr;
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                return;
            }

            if (stdout == "") {
                result.status = "FAILED";
                result.message = "当前未连接iPhone，请先用USB连接设备！";
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                return;
            }

            let textArr = stdout.split(/[(\r\n)\r\n]+/);
            logger.info(tag, "textArr: " + textArr);

            for (let i = 0; i < textArr.length; i++) {
                let textArrItem = textArr[i];
                let itemArr = textArrItem.split(" ");

                let iphone = {
                    udid: itemArr[0],
                    name: itemArr[1],
                    connectionType: itemArr[2],
                }
                result.iphoneList.push(iphone);
            }
            result.message = "Connection Success!";
            window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));

            // 启动Server
            const server = net.createServer(() => {});
            server.listen(port, () => {});

            server.on('listening', function () {
                server.close();
                logger.info(tag, 'The port【' + port + '】 is available.');

                bootstrap();
                result.message = "Server Success!";
                window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));

                // 启动WDA
                startWda(
                    (data) => {
                    },
                    (data) => {
                        let dataStr = new String(data);
                        if (dataStr.indexOf("WebDriverAgent start successfully") > -1) {
                            result.message = "WDA Success!";
                            window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                        }
                    },
                    (code) => {
                    },
                    (pid) => {
                        result.wdaPid = pid;
                    },
                    result.iphoneList[0].udid);
            });

            server.on('error', function (err) {
                if (err.code === 'EADDRINUSE') {
                    logger.info(tag, 'The port【' + port + '】 is occupied, please change other port.');
                    result.status = "FAILED";
                    result.message = `端口号: ${port}已被占用，请先关闭占用${port}端口号的进程再重新启动！`;
                    window.webContents.send(eventChannel.oneKeyLaunchResult, JSON.stringify(result));
                    return;
                }
            });
        });
    });
}

let heartBeatTask;
const heartRate = 10;
const port = 3000;

/**
* @name: listenLanuchHeartBeatTask
* @Description: 监听启动心跳任务事件
* @Param: window <BroswerWindow> 窗口
* @Return:
* @Author: geekmister
* @Date: 2021/10/27
*/
function listenLanuchHeartBeatTask(window) {
    logger.verbose(tag, "===== listenLanuchHeartBeatTask() =====");

    ipcMain.on(eventChannel.lanuchHeartBeatTask, (event, args) => {
        logger.info(tag, `receive message: ${eventChannel.lanuchHeartBeatTask}`);

        /**
         * 启动心跳
         * @type {NodeJS.Timer}
         */
        heartBeatTask = setInterval(() => {
            let data = {
                ip: `${IP.address()}:${port}`,
                status: "ready",
                interval: heartRate
            }
            heartBeat(data)
                .then(res => {
                    // 心跳接口不管成功与否，都不进行处理，如果以后需要再这里增加代码即可
                })
                .catch(err => {
                    logger.error(tag, "err: ", err);
                })
                .finally(() => {
                    logger.info(tag, "heart beat complete...");
                });

            /**
             * 获取iOS列表
             */
            getiOSList((error, stdout, stderr) => {
                if(stdout != "") {
                    let textArr = stdout.split("\n");
                    if(textArr[textArr.length] == undefined) {
                        let textArrLength = textArr.length;
                        textArr.length = textArrLength - 1;
                    }

                    for (let i = 0; i < textArr.length; i++) {
                        let textArrItem = textArr[i];
                        let itemArr = textArrItem.split(" ");

                        let iphone = {
                            udid: itemArr[0],
                            name: itemArr[1],
                            connectionType: itemArr[2],
                            status: "leisure",
                            version: "",
                            model: "",
                            type: "iOS",
                            ip: "",
                        }

                        getDeviceInfo((error, stdout, stderr) => {
                            if(stdout != "") {
                                let data = JSON.parse(stdout);
                                iphone.version = data.ProductVersion;
                                iphone.ip = data.WiFiAddress;
                                iphone.model = data.DeviceName;
                            }
                        }, iphone.udid);

                        addIphone(iphone);
                    }
                }
            });
        }, heartRate * 1000);
    });
}

/**
* @name: listenStopHeartBeatTask
* @Description: 监听停止心跳任务事件
* @Param: window <BroswerWindow> 窗口
* @Return:
* @Author: geekmister
* @Date: 2021/10/27
*/
function listenStopHeartBeatTask(window) {
    logger.verbose(tag, "===== listenStopHeartBeatTask() =====");

    ipcMain.on(eventChannel.stopHeartBeatTask, (event, args) => {
        logger.info(tag, `receive message: ${eventChannel.stopHeartBeatTask}`);
        clearInterval(heartBeatTask);
    });
}

/**
 * 确认任务
 * @param data {TaskTdo}
 */
export function confirmTask(data) {
    console.log(tag, "===== confirmTask() =====");
    windows.mainWindow.webContents.send(eventChannel.confirmTask, data);
}

/**
 * 启动任务
 * @param window {object}
 */
function listenLanuchTask(window) {} {
    console.log(tag, "===== lanuchTask() =====");

    ipcMain.on(eventChannel.lanuchTask, (event, args) => {
        console.log(tag, `receive message: ${eventChannel.lanuchTask}`);
        console.log(tag, "taskInfo", args);

        let taskInfo = JSON.parse(args);

        // 转发启动任务消息到工作者
        windows.workWindow.webContents.send(eventChannel.lanuchTask, taskInfo);
    })
}

/**
* @name: registerMainWindowMonitor
* @Description: 注册事件监听
* @Param: window <BrowserWindow> 浏览器窗口
* @Return:
* @Author: geekmister
* @Date: 2021/9/22
*/
export function registerMainWindowMonitor(window) {
    listenOneKeylaunch(window);
    listenOneKeyClose(window);
    listenOneKeyReboot(window);
    listenCloseClient(window);
    listenLanuchHeartBeatTask(window);
    listenStopHeartBeatTask(window);

    /** 接收index.vue发送过来的消息 */
    ipcMain.on("index.vue", (event, args) => {
        logger.debug(tag, "receive message of index.vue", " args: ", args);

        if(args == "receiveSettingData") {
            logger.debug(tag, "receive message: receiveSettingData of index.vue");

            let data = {
                event: args,
                settingFile: getSettingFile()
            }

            windows.mainWindow.webContents.send("mainProcess", data);
        }else if(args === "getPathData") {
            logger.debug(tag, "receive message: getPathData of index.vue");

            let data = {
                event: "receivePathData",
                pathData: getPathData()
            };
            logger.debug(tag, "pathData:", data.pathData);
            windows.mainWindow.webContents.send("mainProcess", data);
        }
    });

    /** 接收worker.vue发送过来的消息 */
    ipcMain.on("worker.vue", ((event, args) => {
        logger.debug(tag, "receive message of worker.vue", " args: ", args);

        if(args[0] == "renderTaskManager") {
            logger.debug(tag, "receive message: renderTaskManager of worker.vue");

            let taskManager = args[1];
            logger.info(tag, "taskManager: ", JSON.stringify(taskManager));

            let data = {
                event: args[0],
                data: taskManager
            }

            windows.mainWindow.webContents.send("mainProcess", data);
        }else if(args[0] == "taskProcess") {
            logger.debug(tag, "receive message: taskProcess of worker.vue");

            let data = {
                event: args[0],
                data: args[1]
            }

            windows.mainWindow.webContents.send("mainProcess", data);
        }else if(args[0] === "completeTask") {
            logger.debug(tag, "receive message: completeTask of worker.vue");

            let data = {
                event: args[0]
            }

            windows.mainWindow.webContents.send("mainProcess", data);
        }
    }));
}