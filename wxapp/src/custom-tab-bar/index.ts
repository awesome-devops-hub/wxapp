Component({
  data: {
    active: null,
    messageCount: null,
    list: [{
      path: '/pages/index/index',
      icon: 'newspaper-o',
      text: '新闻',
    }, {
      path: '/pages/policy/policy',
      icon: 'balance-list-o',
      text: '政策',
    }, {
      path: '/pages/message/message',
      icon: 'chat-o',
      text: '消息',
    }]
  },
  methods: {
    onChange(event) {
      wx.switchTab({
        url: this.data.list[event.detail]?.path
      });
    },
  },
});
