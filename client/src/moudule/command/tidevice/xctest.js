import {exec, spawn} from "child_process";
import {logger} from "../../utils/logger";
import {tideviceConf} from "./tidevice";

const tag = "xctest.js";

/**
* @name: startWda
* @Description:
 * 启动wda
* @Param:
 * callBack <function> 回调函数
 * udid <string> 设备udid
 * isDebug <boolean> 是否开启debug模式，开启后可以获得WDA调试日志
* @Return:
* @Author: geekmister
* @Date: 2021/9/18
*/
export function startWda(callStdout, callStderr, callClose, callPid, udid, isDebug=false) {
    logger.verbose(tag, "===== startWda() =====");
    logger.debug(tag, "udid: " + udid + "; " + "isDebug: " + isDebug);

    let cmd = `${tideviceConf.cmdPath} --udid ${udid} xctest -B com.facebook.WebDriverAgentRunner.xctrunner ${isDebug ? '--debug' : ''}`;
    logger.debug(tag, "cmd: " + cmd);

    const workerProcess = exec(cmd, {maxBuffer: 1024 * 1024 * 200});
    logger.info(tag, "child pid: " + workerProcess.pid);

    callPid(workerProcess.pid);

    workerProcess.stdout.on('data', (data) => {
        // logger.info(tag, "stdout data: " +  data);
        callStdout(data);
    });

    workerProcess.stderr.on('data', (data) => {
        // logger.info(tag, "stderr data: " + data);
        callStderr(data);
    });

    workerProcess.on('close', (code) => {
        // logger.info(tag, `child process exited with code ${code}`);
        callClose(code);
    });
}