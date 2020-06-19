# wxapp
For Chinese README file, please refer to [README_CN.md](https://github.com/awesome-devops-hub/wxapp/blob/master/README_CN.md)

wxapp is a TOC internal beach project for the purpose of WeChat mini-program capability building. It aims to build a mini-program which enables quick access to company resources (policies, newsletters etc.) and notifications from Admin/HR to other staffs. 

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
1. To preview and debug on your mobile phone, click the "preview" button on the navigation bar, and operate as prompted. 

#### Run the functional test

First of all, In the settings of your WeChat Devtools, turn on the "Service Port" option in "Security" tab. 

Make sure the project window in WeChat Devtools is closed (otherwise the test will fail in launching the project). Then go back to your terminal and navigate to proper working directory. Run: 
```bash
npm test
```
Your WeChat Devtools should launch automatically and run all tests. When all tests are finished, a HTML test report can be found in `src/functional_test/test_reportts/`. 
