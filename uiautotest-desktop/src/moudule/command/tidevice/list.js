import {exec} from "child_process";
import {tideviceConf} from "./tidevice";
import {logger} from "../../utils/logger";

const tag = "list.js";

/**
* @name: getiOSList
* @Description:
 * 获取iOS设备列表
* @Param:
 * callBack <function> 回调函数
* @Return:
* @Author: geekmister
* @Date: 2021/9/18
*/
export function getiOSList(callBack) {
    // logger.debug(tag, `"cmdPath: ${tideviceConf.cmdPath}`);
    exec(
        `${tideviceConf.cmdPath} list`,
        (error, stdout, stderr) => {
            logger.error(tag, `exec error: ${error}`);
            logger.info(tag,`exec stdout: ${stdout}`);
            logger.error(tag, `exec stderr: ${stderr}`);
            callBack(error, stdout, stderr);
        })
}