/**
 * property
 *
 * idbPath: idb python package(idb命令包)所在路径
 * idbCmdLogLevel: idb命令执行日志等级(全局控制)
 *
 * @type {{idbPath: string, idbCmdLogLevel: string, setCommandLogLevel: stage.setCommandLogLevel}}
 */
export const stage = {
    idbPath: '/Users/geekchief/Desktop/Work/Workspace/pyenv/3.7.10/bin/idb',
    idbCmdLogLevel: 'DEBUG',
    setCommandLogLevel: (level) => {
        stage.idbCmdLogLevel = level;
    },
}