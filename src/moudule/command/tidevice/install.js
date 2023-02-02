import {exec, spawn} from "child_process";
import {logger} from "../../utils/logger";
import {tideviceConf} from "./tidevice";

const tag = "install.js";

/**
* @name: install
* @Description:
 * 安装app
* @Param:
 * callBack <function> 回调函数
 * udid <string> 设备唯一id
 * uri <string> ipa文件路径（支持local path 和 url）
 * isLaunch <boolean> 安装后是否启动，默认值为false
* @Return:
* @Author: geekmister
* @Date: 2021/10/9
*/
export function install(callBack, udid, uri, isLaunch=false) {
    logger.verbose(tag, "===== install() =====");

    logger.debug(tag, `udid: ${udid} , uri: ${uri}`);

    let cmd = `${tideviceConf.cmdPath} --udid ${udid} install ${uri} ${isLaunch ? '--launch' : ''}`;
    logger.debug(tag, "cmd: " + cmd);

    exec(
        cmd,
        (error, stdout, stderr) => {
            // logger.error(tag, `exec error: ${error}`);
            // logger.info(tag,`exec stdout: ${stdout}`);
            // logger.error(tag, `exec stderr: ${stderr}`);
            callBack(error, stdout, stderr);
        })
}