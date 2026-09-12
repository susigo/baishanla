Component({
  properties: {
    height: { type: Number, value: 140 },
    label: { type: String, value: '' },
    variant: { type: Number, value: 0 },
  },
  data: {
    src: '/assets/cover-sage.png',
  },
  observers: {
    variant(v) {
      this.setData({
        src: Number(v) % 2 === 1 ? '/assets/cover-blush.png' : '/assets/cover-sage.png',
      })
    },
  },
})
