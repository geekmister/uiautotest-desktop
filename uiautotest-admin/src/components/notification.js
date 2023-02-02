/*
    notification
 */

import {h} from "vue";
import { SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons-vue';
import {notification} from "ant-design-vue";
import "ant-design-vue/lib/notification/style/css";

/**
 * @function openSuccessNotification
 * @desc 打开成功Notification
 * @param msg {string} 消息
 */
export function openSuccessNotification(msg) {
    notification.open({
        message: "成功提示",
        description: msg,
        icon: () => h(SmileOutlined, {
            style: 'color: #6DD400',
        }),
        duration: 3
    });
}

/**
 * @function openFailedNotification
 * @desc 打开失败Notification
 * @param msg {string} 消息
 */
export function openFailedNotification(msg) {
    notification.open({
        message: "错误提示",
        description: msg,
        icon: () => h(FrownOutlined, {
            style: 'color: #E02020',
        }),
        duration: 3
    });
}

/**
 * @function openWarnNotification
 * @desc 打开失败Notification
 * @param msg {string} 消息
 */
export function openWarnNotification(msg) {
    notification.open({
        message: "警告提示",
        description: msg,
        icon: () => h(MehOutlined, {
            style: 'color: #F7B500',
        }),
        duration: 3
    });
}