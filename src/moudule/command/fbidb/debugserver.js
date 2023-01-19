/**
 模块说明：封装调试目标设备app的命令
 1、此模块中只封装跟业务相关用的到的命令，用不到不进行封装；
 2、此模块中封装的命令对Simulator和Device都支持，具体略有差异；

 usage: idb debugserver [-h] {start,stop,status} ...

 positional arguments:
     {start,stop,status}
     start              Start the Debug Server
     stop               Stop the debug server
     status             Get the status of the debug server

 optional arguments:
    -h, --help           show this help message and exit
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

/**
*@name: idbDebugServerStart
*@Description:
 * 指定udid，指定bundle，开启一个调试session
 *
 * 原生命令说明：
 *
 * usage: idb debugserver start [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] bundle_id
 *
 * positional arguments:
 *  bundle_id             The bundle id to debug
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
 *
 * 备注：
 * Starts a debug session.
 * The output will be similar to process connect connect://localhost:10881 and it will be used to start the lldb.
 * In another terminal, type in the command lldb,
 * which will start the lldb. There, type the output of the start command to connect the debug server.
*@Param: [udid: 设备唯一id] [bundleId: 应用包名]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbDebugServerStart(udid, bundleId) {
    logger.error("===== idbDebugServerStart() =====");

    exec(
        `${stage.idbPath} debugserver start ${bundleId} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbDebugServerStop
*@Description:
 * 指定udid，停止调试session
 *
 * 原生命令说明：
 *
 * usage: idb debugserver stop [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbDebugServerStop(udid) {
    logger.error("===== idbDebugServerStop() =====");

    exec(
        `${stage.idbPath} debugserver stop --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbDebugServerStatus
*@Description:
 * 获取调试session的信息
 *
 * 原生命令说明：
 *
 * usage: idb debugserver status [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbDebugServerStatus(udid) {
    logger.error("===== idbDebugServerStatus() =====");

    exec(
        `${stage.idbPath} debugserver status --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}