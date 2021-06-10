// pages/home.js
Page({
  data: {
    
  },

  handleTabTap(event) {
    const index = event.detail.index;
    const title = event.detail.title;
    console.log("++++", index, title);
  },

  handleComponentCount() {
    const j_sel = this.selectComponent("#p-sel");
    // j_sel.setData({
    //   count: j_sel.data.count + 1
    // })
    j_sel.countPlus(2);
  },

})