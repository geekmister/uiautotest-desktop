import {exec, spawn} from "child_process";
import {logger} from "../../utils/logger";
import {tideviceConf} from "./tidevice";

const tag = "applist.js";

/**
* @name: applist
* @Description:
 * 获取应用列表
* @Param:
 * callBack <function> 回调函数
 * udid <string> 设备唯一id
* @Return:
* @Author: geekmister
* @Date: 2021/10/9
*/
export function applist(callBack, udid) {
    logger.verbose(tag, "===== applist() =====");

    logger.debug(tag, `udid: ${udid}`);

    let cmd = `${tideviceConf.cmdPath} --udid ${udid} applist`;
    logger.debug(tag, "cmd: " + cmd);

    exec(
        cmd,
        (error, stdout, stderr) => {
            logger.error(tag, `exec error: ${error}`);
            logger.info(tag,`exec stdout: ${stdout}`);
            logger.error(tag, `exec stderr: ${stderr}`);
            callBack(error, stdout, stderr);
        })
}