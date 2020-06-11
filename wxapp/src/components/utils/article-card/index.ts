Component({
  behaviors: [],
  properties: {
    title: String,
    category: String,
    date: String,
  },
  methods: {
    onTap: function () {
      wx.showToast({
        title: `点击了"${this.properties.title?.slice(5)}"`,
        duration: 800,
      });
    }
  }
});
