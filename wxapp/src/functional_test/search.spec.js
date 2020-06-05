describe("search page", () => {
    let miniprogram;
    let search_page;
    
    beforeAll(async () => {
        miniprogram = global.miniprogram;
        search_page = await miniprogram.currentPage();
    }, 30000)

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
