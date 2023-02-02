import {exec} from "child_process";
import {logger} from "../../utils/logger";
import {tideviceConf} from "./tidevice";

const tag = "device.js";

/**
 * 指定udid获取设备信息
 * @method getDeviceInfo
 * @for tidevice
 */
export function getDeviceInfo(callback, udid) {
    exec(
        `${tideviceConf.cmdPath} --udid ${udid} info --json`,
        (error, stdout, stderr) => {
            // logger.error(tag, `exec error: ${error}`);
            // logger.info(tag,`exec stdout: ${stdout}`);
            // logger.error(tag, `exec stderr: ${stderr}`);
            callback(error, stdout, stderr);
        })
}