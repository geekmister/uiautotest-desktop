/**
 模块说明：dylib命令

 usage: idb dylib [-h] {install} ...

 positional arguments: {install}
    install   Install an dylib
 optional arguments:
    -h, --help  show this help message and exit
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

/**
*@name: idbDylibInstall
*@Description:
 * 在目标上安装一个.dylib。这可以在应用发布时注入到应用中
 *
 * usage: idb dylib install [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] dylib_path
 *
 * positional arguments:
 *  dylib_path            Path to the dylib to install
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id] [path: 要安装dylib的路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/13
*/
export function idbDylibInstall(udid, path) {
    logger.error("===== idbDylibInstall() =====");

    exec(
        `${stage.idbPath} dylib install ${path} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}