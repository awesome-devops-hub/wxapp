![GitHub contributors](https://img.shields.io/github/contributors/awesome-devops-hub/wxapp) ![node-current](https://img.shields.io/node/v/eslint-loader) ![Wechat Devtools](https://img.shields.io/badge/Wechat%20Devtools-%3E%3D1.02.1907232-green)

# wxapp

For Chinese README file, please refer to [README_CN.md](https://github.com/awesome-devops-hub/wxapp/blob/master/README_CN.md) | 中文README文档请见[README_CN.md](https://github.com/awesome-devops-hub/wxapp/blob/master/README_CN.md)

wxapp is an internal project for the purpose of WeChat mini-program capability building. The original idea was to build a mini-program which enables quick access to some of the company resources (policies, newsletters etc.) and notifications from Admin/HR to other staffs. 

This project aims to build a mini-program interface. All backend logics are mocked. 


## Getting started

### Prerequistes

- [WeChat devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- npm
- node

### Starting the project

#### Build the project

In your terminal, run: 
```bash
cd wxapp/
npm i
npm start
```

#### Run the project

You may need a WeChat account which is a member of "TW工作坊" to collaborate. 

1. Launch WeChat Devtools and log in as prompted
1. Import the project from `wxapp/wxapp`. The AppID will automatically be filled once you choose the correct directory
1. In the simulator pane, you can preview and debug the mini-program on your laptop
1. To preview and debug on your mobile phone, click the "preview" button on the navigation bar, and operate as prompted

#### Run the functional test

First of all, In the settings of your WeChat Devtools, turn on the "Service Port" option in "Security" tab. 

Make sure the project window in WeChat Devtools is closed (otherwise the test will fail in launching the project). Then go back to your terminal and run: 
```bash
npm test
```
Your WeChat Devtools should launch automatically and run all tests. When all tests are finished, a HTML test report can be found in `src/functional_test/test_reportts/`. 

If you need to run these functional test on your mobile device, open `src/functional_test/tests.spec.js` and set the variable value of `remote` to `true`. Then when you run the test, you will have to manually confirm in a dialogue box of Devtools so the test can proceed. 
