import {logger} from "../../utils/logger";
import {exec} from "child_process";

/**
*@name: cmdExec
*@Description:
 * 命令执行
*@Param: [cmd: 命令行字符串]
*@return:
*@Author: Mr.geek
*@date: 2021/8/13
*/
export function cmdExec(cmd) {
    logger.verbose("===== cmdExec() =====");

    exec(cmd, (error, stdout, stderr) => {
            logger.error(`exec error: ${error}`);
            logger.error(`exec stdout: ${stdout}`);
            logger.error(`exec stderr: ${stderr}`);
        })
}