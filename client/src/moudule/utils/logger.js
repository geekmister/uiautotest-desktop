import log from 'electron-log';
import path from 'path';

const tag = "logger.js";

/* 配置系统日志管理 */
const logger = log.create("logger");
logger.transports.file.console = true;                                          // console日志开关

/**
 * 初始化日志
 * @param catelog 日志存储目录
 * @param file 日志文件（按天区分）
 */
function initLogger(catelog, file) {
    logger.verbose(tag, "===== logger() =====");
    logger.debug(tag, `日志文件名: ${file}`);

    logger.transports.file.level = true;                                        // 文件日志开关
    logger.transports.file.resolvePath = (variables) => {          // 日志存储路径
        return path.join(catelog, file);
    };
}

export {
    logger,
    initLogger
}