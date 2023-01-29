import {exec} from "child_process";
import {logger} from "../../utils/logger";

const tag = "electronCmd.js";

/**
* @name: killProcessByPid
* @Description: 根据进程id杀死进程
* @Param:
 * callBack <function> 回调函数
 * pid <int> 进程id
* @Return:
* @Author: geekmister
* @Date: 2021/9/27
*/
export function killProcessByPid(callBack, pid) {
    logger.verbose(tag, "===== killProcessByPid() =====");
    logger.info(tag, "pid: " + pid);

    let cmd = process.platform === 'win32' ? `taskkill /f /pid ${pid}` : `kill -9 ${pid}`;

    exec(
        cmd,
        (error, stdout, stderr) => {
            logger.error(tag, `exec error: ${error}`);
            logger.info(tag,`exec stdout: ${stdout}`);
            logger.error(tag, `exec stderr: ${stderr}`);
            callBack(error, stdout, stderr);
        })
}