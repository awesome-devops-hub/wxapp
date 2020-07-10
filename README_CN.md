![node-current](https://img.shields.io/node/v/eslint-loader) ![Wechat Devtools](https://img.shields.io/badge/Wechat%20Devtools-%3E%3D1.02.1907232-green)

# wxapp

For English README file, please refer to [README.md](https://github.com/awesome-devops-hub/wxapp/blob/master/README.md)

wxapp是一个提升小程序开发能力的内部项目。此项目的原本愿景是构建一个能快速访问一部分公司资源（政策、newsletters等）并能允许Admin和HR向员工推送信息的小程序。

这个项目目前只构建一个小程序的界面，所有的后端逻辑均为mock。 


## 快速开始

### 需求

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- npm
- node

### 代码结构

```
wxapp
├── babel.config.js
├── dist
├── env
├── jest.config.js
├── node_modules
├── package-lock.json
├── package.json
├── project.config.json
├── src
├── tsconfig.json
├── webpack
└── webpack.config.ts
```

- env 环境配置
- src 项目源代码

```
src
├── app.json
├── app.scss
├── app.ts
├── assets
├── components
├── core
├── custom-tab-bar
├── functional_test
├── mock
├── pages
├── protocol
└── styles
```

- assets 静态资源
- components 可复用的自定义组件
- core 工具组件
- custom-tab-bar 小程序底部导航
- functional_test 功能测试模块
- mock 模拟数据
- pages 小程序页面
- protocol 由google的protocol buffers生成的类，主要用于远端通信
- styles 样式文件
- app.* [微信小程序相关配置](https://developers.weixin.qq.com/miniprogram/dev/framework/structure.html)

### 创建mock类

[使用 goodle 的 protocol buffers 定义前后端的契约文档](https://developers.google.cn/protocol-buffers/)

请参见 ``wxapp/docs/proto``

### 启动项目

#### 构建项目

在终端运行：
```bash
cd wxapp/
npm i
npm start
```

#### 运行项目

你可能需要需要一个是“TW工作坊”的微信账号才能参与本项目协作。

1. 启动微信开发者工具并按提示登录
1. 从`wxapp/wxapp`导入项目. 当你选择了正确的路径后，AppID会自动填入
1. 在模拟器界面，你可以在电脑上预览并debug
1. 如果需要在手机上运行，请点击导航栏上的"preview"按钮并按提示操作

#### 运行功能测试

首先，请在微信开发者工具的设置界面中，在“Security”面板里打开“Service Port”选项

确保你没有在微信开发工具中打开任何项目窗口（否则测试会在尝试启动项目时失败），然后回到终端，运行：
```bash
npm test
```
你的微信开发者工具应该会自动运行并运行所有测试。当测试运行完成之后，HTML测试报告将声称在`src/functional_test/test_reportts/`. 

如果你需要在真机上运行功能测试，打开`src/functional_test/tests.spec.js`并将`remote`的值设置为`true`。然后当你运行测试时，你需要手动在微信开发者工具的一个对话框中确认，测试才能继续运行。
