import {app} from "electron";

let iphones = [];
const userData = app.getPath('userData');

export function getUserData() {
    return userData;
}

/**
 * 添加iphone
 * @param iphone {object}
 */
export function addIphone(iphone) {
    if(iphones.length == 0) {
        iphones.push(iphone);
    }else {
        let isExist = false;
        for(let i = 0; i < iphones.length; i++) {
            if(iphones[i].udid == iphone.udid) {
                isExist = true;
            }
        }
        if(!isExist) {
            iphones.push(iphone);
        }
    }
}

/**
 * 获取iphone列表
 * @return {[]}
 */
export function getIphones() {
    return iphones;
}

/**
 * 获取iphone信息
 * @param query {object}
 * @return {null|*}
 */
export function getIphone(query) {
    for(let i = 0; i < iphones.length; i++) {
        if(iphones[i].udid == query.udid) {
            return iphones[i];
        }
    }

    return null;
}