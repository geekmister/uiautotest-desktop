import yaml from "js-yaml";
import fs from "fs";

function loadTestCaseFile() {
    try {
        let testCase = yaml.load(fs.readFileSync("/Users/geekchief/Desktop/demo.yaml", 'utf8'));
        console.log(testCase);
    } catch (e) {
        console.log(e);
    }
}

// loadTestCaseFile();

function testHasOwnProperty() {
    let testCase = {
        test_info: [
            {
                id: 'test100',
                title: '测试用例DEMO',
                info: '以首页被测目标，用此测试用例作为测试用例模板，尽量覆盖所有操作情况，同时用作以后的演示和教程模板',
                product: '无忧行iOS客户端',
                group: '基础组',
                status: '有效',
                environment: [Array],
                iteration: [Array]
            }
        ],
        test_case: [
            {
                element_info: 'label=无忧头条',
                find_type: 'link text',
                operate_type: 'click',
                info: '演示指定指定label和link text，点击元素的操作'
            },
            { is_time: 5 }
        ],
        check: [
            {
                element_info: '//XCUIElementTypeButton[@name="chat icon more"]',
                find_type: 'xpath',
                info: '检查聊天套件是否存在'
            }
        ]
    };

    console.log(testCase.hasOwnProperty("test_info"));
    console.log(testCase.hasOwnProperty("test"));
}

// testHasOwnProperty();

let queue = [1,2,3,4,5];
let index = 0;
let delay = 0;
let worker = null;
function start() {
    if(worker != null) {
        clearInterval(worker);
    }

    delay = `${index}000`;

    worker = setInterval(() => {
        console.log(queue[index]);
        // 此处编写业务代码
        if(index < queue.length) {
            index++;
            start();
        }

        if(index == queue.length) {
            clearInterval(worker);
        }
    }, delay);
}

// start();

/**
 * 模拟线程睡眠
 * @param second {int}
 * @return {Promise<unknown>}
 */
// function sleep(second) {
//     return new Promise((resolve, reject)=>{
//         let object = () => {
//             return {
//                 name: "Geekmister",
//                 introduce: "程序员 / 创业者 / 自媒体 / 黑客 / 美店老板"
//             }
//         };
//
//         setTimeout(()=>{
//             resolve(object);
//         }, second * 1000);
//     })
// }

/**
 * 测试函数
 * @return {Promise<void>}
 */
// async function test() {
//     let second = 5;         // 定义秒数
//     let object = await sleep(second);
//     console.log(second, "s后收到对象: ", object);
// }

// test();

/**
 * 模拟线程睡眠
 * @param millisecond {毫秒数}
 * @return {Promise<unknown>}
 */
function sleep(millisecond) {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve();
        }, millisecond);
    })
}

async function test() {
    await sleep(5000);
    console.log("5s后执行了！");
}

// test();


import {XMLHttpRequest} from 'xmlhttprequest';

/**
 * 同步版axios get请求
 * @param url {string} 请求地址
 * @param responseType {string} 响应类型
 * @return {Promise<unknown>}
 */
async function get() {
    console.log("===== get() =====");

    await sleep(5000);

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "http://localhost:8081/demo.yaml", false);
    xmlhttp.responseType = "arraybuffer";

    xmlhttp.send(null);

    console.log(xmlhttp.responseText);
}

// get();


function pathIsExists() {
    try {
        let stat = fs.statSync("/Users/geekchief/Desktop/abc");
        // stat.isDirectory() ? console.log("存在！") : console.log("不存在！");
    }catch (e) {
        console.log(e);
        fs.mkdirSync("/Users/geekchief/Desktop/abc");
    }
}

// pathIsExists();

let object = {
    name: "suntai",
    age: 18
}

for (let key in object) {
    console.log("key: ", key);
}