const net = require('net');

import {logger} from "../utils/logger";

const tag = "dataUtils.js";

/**
* @name: portIsOccupied
* @Description: 检测端口号是否被占用
* @Param:
 * port <int> 端口号
* @Return:
* @Author: geekmister
* @Date: 2021/9/22
*/
export function portIsOccupied (port) {
    logger.verbose(tag, "===== portIsOccupied() =====");

    let isAvailable = true;

    let server = net.createServer().listen(port);

    server.on('listening', function () {
        server.close();
        logger.info(tag, 'The port【' + port + '】 is available.');
    });

    server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            isAvailable = false;
            logger.info(tag, 'The port【' + port + '】 is occupied, please change other port.');
        }
    });

    return isAvailable;
}
