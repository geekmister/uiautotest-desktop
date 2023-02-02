import {logger} from "../../utils/logger";

const tag = "tidevice.js";

/**
 * 获取命令执行路径
 */
export function getCmdPath() {
    let cmdPath = "";

    if(process.platform === 'darwin'){
        logger.info(tag, `当前系统是：macOS，cmdPath：${cmdPath}`);
        if(process.env.WEBPACK_DEV_SERVER_URL) {
            cmdPath = "/Users/geekchief/Desktop/Work/Workspace/Geekkampong/uiautotest/uiautotest-client/app/src/moudule/resources/environment/mac/bin/tidevice";
        }else {
            cmdPath = __dirname.replace("/app.asar", "")
                + '/extraResources/environment/mac/bin/tidevice';
        }
    } else if(process.platform === 'win32'){
        logger.info(tag, "当前系统是：windows");
        cmdPath = "tidevice";
    } else if(process.platform === 'linux'){
        logger.info(tag, "当前系统是：linux");
    }else {
        logger.error(tag, "当前系统是：未知，程序发生异常，需要开发者解决！");
    }

    logger.debug(tag, `cmdPath: ${cmdPath}`);
    return cmdPath;
}

export const tideviceConf = {
    cmdPath: getCmdPath()
}