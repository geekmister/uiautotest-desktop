/**
模块说明：封装iOS目标设备组命令
 1、此模块中只封装跟业务相关用的到的命令，用不到不进行封装；
 2、此模块中封装的命令都只针对于真机的命令，不针对模拟器；
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

/**
*@name: idbListTargets
*@Description:
 * 获取当前真实设备列表（已去除模拟器等，只返回当前真实链接的设备）
 *
 * 原生命令说明：
 * usage: idb list-targets [-h] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param:
*@return: devices <json>
*@Author: Mr.geek
*@date: 2021/8/9
*/
export function idbListTargets() {
    logger.error("===== idbListTargets() =====");

    exec(`${stage.idbPath} list-targets --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
        logger.error(`exec error: ${error}`);
        logger.error(`exec stdout: ${stdout}`);
        logger.error(`exec stderr: ${stderr}`);
    })
}

/**
*@name: idbConnect
*@Description:
 * 指定udid链接一台设备（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb connect [-h] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] companion [port]
 * positional arguments:
 *  companion             Host the companion is running on. or the UDID of the target
 *  port                  Port the companion is running on
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id]
*@return: results <json>
*@Author: Mr.geek
*@date: 2021/8/9
*/
export function idbConnect(udid) {
    logger.error("===== idbConnect() =====");

    exec(`${stage.idbPath} connect --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbDisConnect
*@Description:
 * 指定udid断开设备链接（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb disconnect [-h] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] companion [port]
 * positional arguments:
 *  companion             Host the companion is running on or the udid of the target
 *  port                  Port the companion is running on
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id]
*@return: results <json>
*@Author: Mr.geek
*@date: 2021/8/9
*/
export function idbDisConnect(udid) {
    logger.error("===== idbDisConnect() =====");

    exec(`${stage.idbPath} disconnect --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbDescribeTarget
*@Description:
 * 指定udid获取设备信息（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb describe [-h] [--diagnostics] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --diagnostics         Fetch additional target diagnostics
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
 *      return:
 *          1、UDID（设备唯一id）
 *          2、Name（设备名称）
 *          3、Screen dimensions and density（屏幕尺寸和密度）
 *          4、State (booted/...)（状态(启动/……)）
 *          5、Type (simulator/device)（类型(模拟器/设备)）
 *          6、iOS version（iOS版本）
 *          7、Architecture（CPU体系结构）
 *          8、Information about its companion（关于它Compain的信息）
*@Param: [udid: 设备唯一id]
*@return: deviceInfo <json>
*@Author: Mr.geek
*@date: 2021/8/9
*/
export function idbDescribeTarget(udid) {
    logger.error("===== idbDescribeTarget() =====");

    exec(`${stage.idbPath} describe --udid ${udid} --log ${stage.commandLogLevel} --json --diagnostics`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}