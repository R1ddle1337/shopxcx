Component({
  properties: {
    imgUrl: {
      type: String,
      value: 'https://tdesign.gtimg.com/miniprogram/template/retail/template/empty-cart.png',
    },
    tip: {
      type: String,
      value: '菜篮还是空的',
    },
    btnText: {
      type: String,
      value: '去逛果蔬',
    },
  },
  data: {},
  methods: {
    handleClick() {
      this.triggerEvent('handleClick');
    },
  },
});
