/**
 模块说明：封装单元测试的命令
 1、此模块中只封装跟业务相关用的到的命令，用不到不进行封装；
 2、此模块中封装的命令都只针对于真机的命令，不针对模拟器；
 */

import { exec } from 'child_process';

import {stage} from "./config";
import {logger} from "../../utils/logger";

/**
*@name: idbXctestInstallApp
*@Description:
 * 指定udid，安装app（已去除根据port指定链接）
 *
 * 原生命令说明：
 *
 * usage: idb xctest install [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json] test_bundle_path
 *
 * positional arguments:
 *  test_bundle_path      Bundle path of the test bundle
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id, path: 测试包路径]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbXctestInstallApp(udid, path) {
    logger.verbose("===== idbXctestInstallApp() =====");

    exec(`${stage.idbPath} xctest install ${path} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbXctestList
*@Description:
 * 指定udid，获取测试列表（已去除根据port指定链接）
 *
 * 原生命令说明：
 * usage: idb xctest list [-h] [--udid UDID] [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log                 {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
*@Param: [udid: 设备唯一id]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbXctestList(udid) {
    logger.verbose("===== idbXctestList() =====");

    exec(`${stage.idbPath} xctest list --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}

/**
*@name: idbXctestListBundle
*@Description:
 * 指定udid，列出app内测试列表（已去除根据port指定链接）
 *
 * usage: idb xctest list-bundle [-h] [--app-path APP_PATH] [--install] [--udid UDID]
 *      [--log {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--json]
 *
 * positional arguments:
 *  test_bundle_id        Bundle id of the test bundle to list
 *
 * optional arguments:
 *  -h, --help            show this help message and exit
 *  --app-path APP_PATH   Path of the app of the test (needed for app tests)
 *  --install             When this option is provided bundle_ids are assumed to
 *      be paths instead. They are installed before listing.
 *  --udid UDID           Udid of target, can also be set with the IDB_UDID env var
 *  --log {DEBUG,INFO,WARNING,ERROR,CRITICAL}
 *      Set the logging level. Deprecated: Please place --log
 *      before the command name
 *  --json                Create json structured output
 *  test_bundle_id
*@Param: [udid: 设备唯一id; testBundleId: 测试包id]
*@return: result <json>
*@Author: Mr.geek
*@date: 2021/8/10
*/
export function idbXctestListBundle(udid, testBundleId) {
    logger.verbose("===== idbXctestListBundle() =====");

    exec(`${stage.idbPath} xctest list-bundle ${testBundleId} --udid ${udid} --log ${stage.commandLogLevel} --json`,
        (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}