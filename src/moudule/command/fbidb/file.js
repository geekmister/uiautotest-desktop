/**
 模块说明：封装操作目标设备容器内的命令
 1、此模块中只封装跟业务相关用的到的命令，用不到不进行封装；
 2、此模块中封装的命令对Simulator和Device都支持，具体略有差异，差异如下：
    Simulator: --bundle-id（支持） | --media（支持） | --crashes（不支持）
    Devices: --bundle-id（支持） | --media（支持） | --crashes（支持，仅适用于使用开发人员概要文件签名的应用程序）
 3、iOS文件系统采用沙箱理念，每一个App都会有一个Container，
    照片和视频有一个系统层的Container，App logs和System logs也有一个专门的Container
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

// 容器常量
export const container = {
    bundle: "--bundle_id",
    root: "--root",
    media: "--media",
    crashes: "--crashes",
    provisioningProfiles: "--provisioning-profiles",
    mdmProfiles: "--mdm-profiles",
    springboardIcons: "--springboard-icons",
    wallpaper: "--wallpaper"
}

/**
*@name: idbFilePush
*@Description:
 * 将一个或多个文件从主机复制到容器内的相对目标路径
 *
 * 原生命令说明：
 * usage: idb file push
 *  [-h]
 *  [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 *  [--udid UDID]
 *  [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 *  [--json]
 *  src_paths [src_paths ...] dest_path
 *
 * positional arguments:
 *  src_paths             Path of file(s) to copy to the target
 *  dest_path
 *      Directory relative to the data container of the application to copy the files into. Will be created if
 *      non-existent
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
 *      Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [srcPath: host文件路径，如果传多文件，文件间用空格分割]
 * [destPath: 容器目标路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFilePush(udid, container, srcPath, destPath) {
    logger.error("===== idbFilePush() =====");

    exec(
        `${stage.idbPath} file push ${container} ${srcPath} ${destPath} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbFileMove
*@Description:
 * 将容器内一个或多个文件移动到另外一个文件目录下
 *
 * 原生命令说明：
 *
 * usage: idb file move
 *  [-h]
 *  [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 *  [--udid UDID]
 *  [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 *  [--json]
 *  src [src ...] dst
 *
 * positional arguments:
 *  src                   Source paths relative to Container
 *  dst                   Destination path relative to Container
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
        Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [srcPath: 被移动文件路径，如果传多文件，文件间用空格分割]
 * [destPath: 容器目标路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFileMove(udid, container, srcPath, destPath) {
    logger.error("===== idbFileMove() =====");

    exec(
        `${stage.idbPath} file move ${container} ${srcPath} ${destPath} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbFilePull
*@Description:
 * 从设备中容器复制一个文件到本地
 *
 * 原生命令说明：
 *
 * usage: idb file pull
 *  [-h]
 *  [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 *  [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 *  [--json]
 *  src dst
 *
 * positional arguments:
 *  src                   Relative Container source path
 *  dst                   Local destination path
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
        Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [srcPath: 被复制文件路径]
 * [destPath: 本地文件路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFilePull(udid, container, srcPath, destPath) {
    logger.error("===== idbFilePull() =====");

    exec(
        `${stage.idbPath} file pull ${container} ${srcPath} ${destPath} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbFileMkdir
*@Description:
 * 在目标容器内创建一个目录
 *
 * 原生命令说明：
 *
 * usage: idb file mkdir
 * [-h]
 * [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 * [--udid UDID]
 * [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 * [--json]
 * path
 *
 * positional arguments:
 *  path                  Path to directory to create
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
 *      Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [path: 路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFileMkdir(udid, container, path) {
    logger.error("===== idbFileMkdir() =====");

    exec(
        `${stage.idbPath} file mkdir ${container} ${path} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbFileRemove
*@Description:
 * 删除目标设备容器内的目录
 *
 * 原生命令说明：
 * usage: idb file remove
 * [-h]
 * [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 * [--udid UDID]
 * [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 * [--json]
 * path [path ...]
 *
 * positional arguments:
 *  path                  Path of item to remove (A directory will be recursively deleted)
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
 *      Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [path: 路径，多个路径用空格分割]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFileRemove(udid, container, path) {
    logger.error("===== idbFileRemove() =====");

    exec(
        `${stage.idbPath} file remove ${container} ${path} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbFileList
*@Description:
 * 返回指定设备容器目录中的文件列表
 *
 * 原生命令说明：
 *
 * usage: idb file list
 *  [-h]
 *  [--force-new-output]
 *  [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 *  [--udid UDID]
 *  [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 *  [--json]
 *  paths [paths ...]
 *
 * positional arguments:
 *  paths                 Source path
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --force-new-output    Force multiple-file output even if a single file is passed
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
 *      Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [path: 路径，多个路径用空格分割]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFileList(udid, container, path) {
    logger.error("===== idbFileList() =====");

    exec(
        `${stage.idbPath} file list ${container} ${path} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbFileRead
*@Description:
 * 远程打开目标设备容器中的一个文件，并写入stdout管道
 *
 * 原生命令说明：
 *
 * usage: idb file read
 *  [-h]
 *  [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 *  [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 *  [--json]
 *  src
 *
 * positional arguments:
 *  src                   Relatve Container source path
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
 *      Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [path: 文件路径]
*@return: stdout <buffer>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFileRead(udid, container, path) {
    logger.error("===== idbFileRead() =====");

    exec(
        `${stage.idbPath} file read ${container} ${path} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbFileWrite
*@Description:
 * 打开stdin管道，写入目的设备容器中远程文件
 *
 * 原生命令说明：
 *
 * usage: idb file write
 * [-h]
 * [--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles | --mdm-profiles | --springboard-icons | --wallpaper]
 * [--udid UDID]
 * [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
 * [--json]
 * dst
 *
 * positional arguments:
 *  dst                   Relatve container destination path
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --bundle-id BUNDLE_ID
 *      Bundle ID of application. If not provided, the 'root' of the target will be used
 *  --root                Use the root file container
 *  --media               Use the media container
 *  --crashes             Use the crashes container
 *  --provisioning-profiles
 *      Use the provisioning profiles container
 *  --mdm-profiles        Use the mdm profiles container
 *  --springboard-icons   Use the springboard icons container
 *  --wallpaper           Use the wallpaper container
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log before the command name
 *  --json                Create json structured output
*@Param:
 * [udid: 设备唯一id]
 * [container: 容器，全部为字符串（--bundle-id BUNDLE_ID | --root | --media | --crashes | --provisioning-profiles
 * | --mdm-profiles | --springboard-icons | --wallpaper）]
 * [path: 文件路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/12
*/
export function idbFileWrite(udid, container, path) {
    logger.error("===== idbFileWrite() =====");

    exec(
        `${stage.idbPath} file write ${container} ${path} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}