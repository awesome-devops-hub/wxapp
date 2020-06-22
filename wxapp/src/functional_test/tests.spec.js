const automator = require("miniprogram-automator");
const expect_or = require("./helpers/expect_or.js");
const check_if_result_page_is_empty = require("./helpers/check_if_result_page_is_empty.js")

let miniprogram;
const remote = false;

jest.setTimeout(60000);

beforeAll(async () => {
    miniprogram = await automator.launch({
      projectPath: "../wxapp"
    });
    if(remote == true) {
        await miniprogram.remote();
    }
});

afterAll(async () => {
    await miniprogram.close();
});


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
    });
    

    it("Hot search entries should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = await search_page.$("div.search-tag");
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect_or(
            () => expect(elem_wxml).toContain("Buddy Program"),
            () => expect(elem_wxml).toContain("暂无")
        );
    });

    it("Search history should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = (await search_page.$$("div.search-tag"))[1];
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect_or(
            () => expect(elem_wxml).toContain("Buddy Program"),
            () => expect(elem_wxml).toContain("暂无")
        );
    });
});


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
    }, 30000);
    

    it("Should see search result page when searching a keyword", async () => {
        const search_input = await search_page.$("input.search-box");
        const keyword = "test";
        await search_input.input(keyword);
        const search_result_page = await miniprogram.navigateTo("/pages/search-result/search-result?key=" + keyword);
        try {
            const search_result_wxml = await(await search_result_page.$("van-tabs")).outerWxml();
            expect_or(
                () => expect(search_result_wxml).toContain("News"),
                () => expect(search_result_wxml).toContain("Policy")
            );
        }
        catch(e) {
            expect(await check_if_result_page_is_empty(search_result_page)).toBe(true);
        }
    });
});


/*
  Story: #15 新闻页面各模块文章list页面
*/
describe("News page", () => {

    let page;

    beforeAll(async () => {
        page = await miniprogram.reLaunch("/pages/index/index");
        await page.waitFor(500);
    }, 30000);

    it("4 Tabs should present", async () => {
        const navigator_bar = await page.$("view.van-tabs__nav.van-tabs__nav--line");
        const nav_bar_text = await navigator_bar.text();
        expect(nav_bar_text).toContain("Newsletter");
        expect(nav_bar_text).toContain("活动");
        expect(nav_bar_text).toContain("博客大赛");
        expect(nav_bar_text).toContain("Admin");
    });

    it("The first tab should contain article card", async() => {
        await expect_article_card_to_exist(page);
    });

    it("The second tab should contain article card", async() => {
        const tabs_selector = "view.van-tabs__nav.van-tabs__nav--line view.van-ellipsis.van-tab";
        const second_tab_elem = (await page.$$(tabs_selector))[1];
        await second_tab_elem.tap();
        if (remote == true) {
            await page.waitFor(5000);
        } else {
            await page.waitFor(1500);
        }
        await expect_article_card_to_exist(page);
    });

    async function expect_article_card_to_exist(page) {
        const content_container = await page.$("van-tab.article-tab");
        const content_container_wxml = await content_container.outerWxml();
        expect(content_container_wxml).toContain("<article-card ");
    }
});
