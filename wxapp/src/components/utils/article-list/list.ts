Component({
  behaviors: [],
  properties: {
    articles: Array,
    paging: Object,
  },
  methods: {
    pageChange: function (event) {
      console.log("[cust-list] => paging", event.currentTarget.dataset.page);
      //bind event name / params / options
      this.triggerEvent("action", event);
    },
  },
});
