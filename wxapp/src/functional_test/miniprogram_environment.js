const NodeEnvironment = require('jest-environment-node');
const jest = require('jest');
const automator = require("miniprogram-automator");

class MiniprogramEnvironment extends NodeEnvironment {

  constructor(config, context) {
    super(config, context);
    this.miniprogram = null;;
    this.run_on_real_device = true;
  }

  async setup() {
    await super.setup();

    this.miniprogram = await automator.launch({
      "projectPath": "../wxapp/"
    })
    this.global.miniprogram = this.miniprogram;

    if (this.run_on_real_device == true){
      await this.miniprogram.remote();
    }

    const page = await this.miniprogram.currentPage();
    await (await page.$("navigator")).tap();
    await page.waitFor(1000);
  }

  async teardown() {
    await this.miniprogram.close(); 
    await super.teardown();
  }
}

module.exports = MiniprogramEnvironment;