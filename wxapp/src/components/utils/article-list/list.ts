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
  },
});
