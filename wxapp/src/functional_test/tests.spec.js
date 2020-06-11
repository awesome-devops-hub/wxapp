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
        await (await page.$("input.van-field__input")).tap();
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


/*
  Story: #11 搜索页面结果
*/
describe("search result page", () => {

    let search_page;

    beforeAll(async () => {
        const page = await miniprogram.reLaunch("/pages/index/index");
        await (await page.$("input.van-field__input")).tap();
        await page.waitFor(1000);
        search_page = await miniprogram.currentPage();
    }, 30000)
    

    it("Should see search result page when searching a keyword", async () => {
        const search_input = await search_page.$("input.search-box");
        const keyword = "test";
        await search_input.input(keyword);
        const search_result_page = await miniprogram.navigateTo("/pages/search-result/search-result?key=" + keyword);
        const search_result_wxml = await(await search_result_page.$("van-tabs")).outerWxml();
        expect_or(
            () => expect(search_result_wxml).toContain("News"),
            () => expect(search_result_wxml).toContain("Policy"),
            () => expect(search_result_wxml).toContain("暂无相关结果")
        )
    })
})
