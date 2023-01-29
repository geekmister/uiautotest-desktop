import {
    createProtocol
    // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';
import {app, protocol} from "electron";

/**
*@name: initVue
*@Description: 初始化vue
*@Param:
*@return:
*@Author: Mr.geek
*@date: 2021/8/18
*/
export function initVue() {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    protocol.registerSchemesAsPrivileged([
        {
            scheme: 'app',
            privileges: {
                secure: true,
                standard: true
            }
        }
    ]);

    if (isDevelopment) {
        if (process.platform === 'win32') {
            process.on('message', data => {
                if (data === 'graceful-exit') {
                    app.quit();
                }
            });
        } else {
            process.on('SIGTERM', () => {
                app.quit();
            });
        }
    }
}