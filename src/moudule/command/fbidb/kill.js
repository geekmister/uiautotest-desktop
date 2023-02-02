/**
 模块说明：杀死idb后台进程命令

 usage: idb kill [-h] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]

 optional arguments:
     -h, --help            show this help message and exit
     --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
         Set the logging level. Deprecated: Please place --log
         before the command name
    --json                Create json structured output
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

/**
*@name: idbKill
*@Description:
 * 杀死idb后台进程
 *
 * usage: idb kill [-h] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param: none
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/13
*/
export function idbKill() {
    logger.error("===== idbKill() =====");

    exec(
        `${stage.idbPath} kill --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}