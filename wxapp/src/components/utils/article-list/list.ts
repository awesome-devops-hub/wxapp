import { RxWx } from "../../../core/utils/RxWx";
Component({
  behaviors: [],
  properties: {
    articles: Array,
    paging: Object,
    optional: Object,
  },
  methods: {
    pageChange: function (event) {
      console.log("[cust-list] => paging", event);
      //bind event name / params / options
      this.triggerEvent("action", event);
    },
    openArticle: function () {
      RxWx.navigateTo("/pages/towxml/towxml", {
        url: "https://wxapp.qun.cool/blog/blog-02.html",
        baseUrl: "https://wxapp.qun.cool/blog/",
      }).subscribe();
    },
  },
});
