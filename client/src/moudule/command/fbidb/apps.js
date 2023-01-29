/**
 模块说明：封装操作App的命令
 1、此模块中只封装跟业务相关用的到的命令，用不到不进行封装；
 2、此模块中封装的命令都只针对于真机的命令，不针对模拟器；
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

/**
*@name: idbListApps
*@Description:
 * 指定udid设备获取app列表（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb list-apps [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 * [--fetch-process-state | --no-fetch-process-state]
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
 *  --fetch-process-state（获取App进程状态）
 *      Fetches App Process State
 *  --no-fetch-process-state（禁用App进程状态获取）
 *      Disables App Process State fetching
*@Param: [udid: 设备唯一id]
*@return: listApps <json>
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbListApps(udid) {
    logger.error("===== idbListApps() =====");

    exec(`${stage.idbPath} list-apps --udid ${udid} --log ${stage.commandLogLevel} --json --fetch-process-state`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbInstallApp
*@Description:
 * 指定udid，安装app（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb install [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] bundle_path
 *
 * positional arguments:
 *  bundle_path           Path to the .app/.ipa to install
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id], [path: 被安装的app存放路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbInstallApp(udid, path) {
    logger.error("===== idbInstallApp() =====");

    exec(`${stage.idbPath} install --udid ${udid} --log ${stage.commandLogLevel} --json ${path}`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbLaunchApp
*@Description:
 * 指定udid，启动app（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb launch [-h] [-d] [-f] [-w] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] bundle_id ...
 *
 * positional arguments:
 *  bundle_id             Bundle id of the app to launch
 *  app_arguments         Arguments to start the app with
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  -d, --wait-for-debugger
 *      Suspend application right after the launch to
 *      facilitate attaching of a debugger (ex, lldb).
 *  -f, --foreground-if-running
 *      If the app is already running foreground that process
 *  -w, --wait-for        Wait for the process to exit, tailing all output from the app
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
     Set the logging level. Deprecated: Please place --log
     before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id; bundleId: 包id]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbLaunchApp(udid, bundleId) {
    logger.error("===== idbLaunchApp() =====");

    exec(
        `${stage.idbPath} launch ${bundleId} --udid ${udid} --log ${stage.commandLogLevel} --json ${path} --foreground-if-running`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbTerminateApp
*@Description:
 * 指定udid，杀死一个正在运行的app（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb terminate [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] bundle_id
 *
 * positional arguments:
 *  bundle_id             Bundle ID of application to uninstall
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id; bundleId: 包id]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbTerminateApp(udid, bundleId) {
    logger.error("===== idbTerminateApp() =====");

    exec(
        `${stage.idbPath} terminate ${bundleId} --udid ${udid} --log ${stage.commandLogLevel} --json ${path}`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUninstallApp
*@Description:
 * 指定udid，卸载一个app（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb terminate [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] bundle_id
 *
 * positional arguments:
 *  bundle_id             Bundle ID of application to uninstall
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param:
*@return:
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbUninstallApp(udid, bundleId) {
    logger.error("===== idbUninstallApp() =====");

    exec(
        `${stage.idbPath} uninstall ${bundleId} --udid ${udid} --log ${stage.commandLogLevel} --json ${path}`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}