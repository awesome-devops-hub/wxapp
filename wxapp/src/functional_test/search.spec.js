const automator = require("miniprogram-automator");

describe("search page", () => {
    let miniprogram;
    let search_page;
    let run_on_real_device = false;

    beforeAll(async () => {
        miniprogram = await automator.launch({
            "projectPath": "../wxapp/"
        })
        if (run_on_real_device == true){
            await miniprogram.remote();
            jest.setTimeout(30000);
        }
        const page = await miniprogram.currentPage();
        await (await page.$("navigator")).tap();
        await page.waitFor(1000);
        search_page = await miniprogram.currentPage();
    }, 30000)

    afterAll(async () => {
        await miniprogram.close();    
    })

    it("Hot search entries should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = await search_page.$("div.search-tag");
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect(elem_wxml).toContain("Buddy Program");
    })

    it("Search history should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = (await search_page.$$("div.search-tag"))[1];
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect(elem_wxml).toContain("Buddy Program");
    })
})
