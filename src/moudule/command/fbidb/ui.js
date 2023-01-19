/**
 模块说明：封装于目标设备ui交互的命令
 1、此模块中只封装跟业务相关用的到的命令，用不到不进行封装；
 2、此模块中封装的命令仅对Simulator支持，

 usage: idb ui [-h]
     {describe-all,describe-point,tap,button,text,key,key-sequence,swipe}
     ...

 positional arguments:
     {describe-all,describe-point,tap,button,text,key,key-sequence,swipe}
     describe-all        Describes Accessibility Information for the entire screen
     describe-point      Describes Accessibility Information at a point on the screen
     tap                 Tap On the Screen
     button              A single press of a button
     text                Input text
     key                 A short press of a keycode
     key-sequence        A sequence of short presses of a keycode
     swipe               Swipe from one point to another point

 optional arguments:
    -h, --help            show this help message and exit
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

// 按钮名称
export const BtnName = {
    applePay: "APPLE_PAY",
    home: "HOME",
    lock: "LOCK",
    side_button: "SIDE_BUTTON",
    siri: "SIRI"
}

/**
*@name: idbUIDescribeAll
*@Description:
 * 获取屏幕元素详细信息
 *
 * 原生命令说明:
 *
 * usage: idb ui describe-all [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] [--nested]

 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
 *  --nested              Will report data in the newer nested format, rather than the flat one
*@Param: [udid: 设备唯一id]
*@return: info <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUIDescribeAll(udid) {
    logger.error("===== idbUIDescribeAll() =====");

    exec(
        `${stage.idbPath} ui describe-all --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUIDescribePoint
*@Description:
 * 在屏幕上某个点描述可访问性信息
 *
 * 原生命令说明：
 *
 * usage: idb ui describe-point [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] [--nested] x y

 * positional arguments:
 *  x                     The x-coordinate
 *  y                     The y-coordinate
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
 *  --nested              Will report data in the newer nested format, rather than the flat one
*@Param: [udid: 设备唯一id] [x: 点横坐标] [y: 点纵坐标]
*@return: info <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUIDescribePoint(udid, x, y) {
    logger.error("===== idbUIDescribePoint() =====");

    exec(
        `${stage.idbPath} ui describe-point ${x} ${y} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUITap
*@Description:
 * 点击屏幕坐标点
 *
 * 原生命令说明：
 *
 * usage: idb ui tap [-h] [--duration DURATION] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] x y
 *
 * positional arguments:
 *  x                     The x-coordinate
 *  y                     The y-coordinate
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --duration DURATION   Press duration
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id] [x: 屏幕横坐标] [y: 屏幕纵坐标]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUITap(udid, x, y) {
    logger.error("===== idbUITap() =====");

    exec(
        `${stage.idbPath} ui tap ${x} ${y} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUIButton
*@Description:
 * 点击button
 *
 * 原生命令说明：
 *
 * usage: idb ui button [-h] [--duration DURATION] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 *        {APPLE_PAY,HOME,LOCK,SIDE_BUTTON,SIRI}
 *
 * positional arguments: {APPLE_PAY,HOME,LOCK,SIDE_BUTTON,SIRI} The button name
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --duration DURATION   Press duration
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id] [duration: 按下后的延迟时间, 无延时传0] [btnName: {APPLE_PAY,HOME,LOCK,SIDE_BUTTON,SIRI}]
*@return:
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUIButton(udid, duration, btnName) {
    logger.error("===== idbUIButton() =====");

    exec(
        `${stage.idbPath} ui button ${btnName} --duration ${duration} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUIText
*@Description:
 * 指定udid，输入内容
 *
 * 原生命令说明：
 *
 * usage: idb ui text [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] text
 *
 * positional arguments:
 *  text                  Text to input
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id] [text: 输入内容]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUIText(udid, text) {
    logger.error("===== idbUIText() =====");

    exec(
        `${stage.idbPath} ui text ${text} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUIKey
*@Description:
 * 输入键码
 *
 * usage: idb ui key [-h] [--duration DURATION] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] key
 *
 * positional arguments:
 *  key                   The key code
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --duration DURATION   Press duration
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id] [duration: 延迟，没有传0] [key: 键码]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUIKey(udid, duration, key) {
    logger.error("===== idbUIKey() =====");

    exec(
        `${stage.idbPath} ui key ${key} --duration ${duration} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUIKeySequence
*@Description:
 * 对keycode一连串短按
 *
 * 原生命令说明：
 *
 * usage: idb ui key-sequence [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 *        [key_sequence [key_sequence ...]]
 *
 * positional arguments:
 *  key_sequence          list of space separated key codes string (i.e. 1 2 3))
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id] [keys: 一组keycode]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUIKeySequence(udid, keys) {
    logger.error("===== idbUIKeySequence() =====");

    exec(
        `${stage.idbPath} ui key-sequence ${keys} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbUIKeySwipe
*@Description:
 * 滑动
 *
 * 原生命令说明：
 *
 * usage: idb ui swipe [-h] [--duration DURATION] [--delta DELTA] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 *        [--json] x_start y_start x_end y_end
 *
 * positional arguments:
 *  x_start               The x-coordinate of the swipe start point
 *  y_start               The y-coordinate of the swipe start point
 *  x_end                 The x-coordinate of the swipe end point
 *  y_end                 The y-coordinate of the swipe end point
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --duration DURATION   Swipe duration
 *  --delta DELTA         delta in pixels between every touch point on the line between start and end points
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id] [xStart: 滑动横坐标开始点] [xEnd: 滑动横坐标结束点] [yStart: 滑动纵坐标开始点] [yEnd: 滑动纵坐标结束点]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbUIKeySwipe(udid, xStart, xEnd, yStart, yEnd) {
    logger.error("===== idbUIKeySwipe() =====");

    exec(
        `${stage.idbPath} ui swipe ${xStart} ${xEnd} ${yStart} ${yEnd} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}
