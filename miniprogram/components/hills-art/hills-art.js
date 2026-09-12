Component({
  properties: {
    height: { type: Number, value: 140 },
    label: { type: String, value: '' },
    variant: { type: Number, value: 0 },
    coverPath: { type: String, value: '' },
    motif: { type: String, value: '' },
    fill: { type: Boolean, value: false },
    flush: { type: Boolean, value: false },
  },
  data: {
    src: '/assets/cover-sage.png',
  },
  observers: {
    'variant, coverPath, motif': function (v, path, motif) {
      if (path) {
        this.setData({ src: path })
        return
      }
      const m = motif || (Number(v) % 2 === 1 ? 'blush' : 'sage')
      this.setData({
        src: m === 'blush' ? '/assets/cover-blush.png' : '/assets/cover-sage.png',
      })
    },
  },
})
