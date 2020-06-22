Component({
  behaviors: [],
  properties: {
    id: String,
    title: String,
    summary: String,
    date: String,
    unread: Boolean,
  },
  methods: {
    onTap: function () {
      wx.showToast({
        title: `点击了"${this.properties.title}"`,
        duration: 800,
      });
      this.triggerEvent('read', this.properties);
    }
  }
});
