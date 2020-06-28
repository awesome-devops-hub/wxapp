import { RxWx } from "../../../core/utils/RxWx";
Component({
  behaviors: [],
  properties: {
    message:Object,
  },
  methods: {
    onTap: function () {
      if (
        this.properties.message.category === "POLICY" &&
        this.properties.message.link.length > 0
      ) {
        RxWx.navigateTo("/pages/towxml/towxml", {
          url: this.properties.message.link,
          baseUrl: "https://wxapp.qun.cool/blog/",
          title: "某一个政策已经更新",
        }).subscribe();
      } else {      
        wx.navigateTo({
          url: "/pages/message/detail/detail?id=" + this.properties.message.id,
        });
      }

      this.triggerEvent("read", this.properties);
    },
  },
});
