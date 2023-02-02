/**
 模块说明：聚焦模拟器窗口命令

 usage: idb focus [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]

 optional arguments:
    -h, --help            show this help message and exit
    --udid UDID           Udid of target, can also be set with the IDB_UDID env var
    --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
        Set the logging level. Deprecated: Please place --log before the command name
    --json                Create json structured output
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

/**
*@name: idbFocus
*@Description:
 * 聚焦模拟器窗口
 *
 * usage: idb focus [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
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
*@date: 2021/8/13
*/
export function idbFocus(udid) {
    logger.error("===== idbKill() =====");

    exec(
        `${stage.idbPath} focus --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}