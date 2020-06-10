const automator = require("miniprogram-automator");
const expect_or = require("./helpers/expect_or.js");

let miniprogram;

jest.setTimeout(60000);

beforeAll(async () => {
    miniprogram = await automator.launch({
      projectPath: "../wxapp"
    })
})

afterAll(async () => {
    await miniprogram.close();
})


/* 
  Story: #10 搜索页面
*/ 
describe("search page", () => {

    let search_page;

    beforeAll(async () => {
        const page = await miniprogram.reLaunch("/pages/index/index");
        await (await page.$("navigator")).tap();
        await page.waitFor(1000);
        search_page = await miniprogram.currentPage();
    })
    

    it("Hot search entries should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = await search_page.$("div.search-tag");
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect_or(
            () => expect(elem_wxml).toContain("Buddy Program"),
            () => expect(elem_wxml).toContain("暂无")
        );
    })

    it("Search history should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = (await search_page.$$("div.search-tag"))[1];
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect_or(
            () => expect(elem_wxml).toContain("Buddy Program"),
            () => expect(elem_wxml).toContain("暂无")
        );
    })
})


