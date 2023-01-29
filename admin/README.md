# uiautotest-web

## 开始
- 安装ant-design-vue
```shell
npm install ant-design-vue@3.0.0-beta.6 --save
```
- 配置按需引入
  - 安装babel-plugin-import
  ```shell
  npm install babel-plugin-import@latest --save-dev
  ```
  - 在项目根目录配置.babelrc.js文件，按照如下配置
  ```javascript
  // .babelrc or babel-loader option
  {
    "plugins": [
        ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }] // `style: true` 会加载 less 文件
    ]
  }
  ```

### Customize configuration(保留)
See [Configuration Reference](https://cli.vuejs.org/config/).
