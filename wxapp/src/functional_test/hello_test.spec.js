const automator = require("miniprogram-automator");

describe("hello test", () => {
    let miniprogram;
    let page;
    let run_on_real_device = false;

    beforeAll(async () => {
        miniprogram = await automator.launch({
            "projectPath": "../wxapp/"
        })
        if (run_on_real_device == true){
            await miniprogram.remote();
            jest.setTimeout(30000);
        }
        page = await miniprogram.currentPage();
    }, 30000)

    afterAll(async () => {
        await miniprogram.close();    
    })

    it("Page should contain Hello world!", async () => {
        const page_wxml = await (await page.$("page")).outerWxml();
        expect(page_wxml).toContain("Hello world!");
    })
})
