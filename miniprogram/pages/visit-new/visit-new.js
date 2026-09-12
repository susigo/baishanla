const store = require('../../utils/store')
const auth = require('../../utils/auth')
const { todayISO } = require('../../utils/ids')

Page({
  data: {
    graves: [],
    graveNames: [],
    graveIndex: 0,
    date: '',
    dateLabel: '今天',
    title: '',
    body: '',
    photos: [],
    openList: false,
  },
  onLoad(q) {
    if (!auth.requireFamily()) return
    const family = store.currentFamily()
    const graves = store.familyGraves(family.id)
    let graveIndex = 0
    if (q.graveId) {
      const idx = graves.findIndex((g) => g.id === q.graveId)
      if (idx >= 0) graveIndex = idx
    }
    const date = todayISO()
    this.setData({
      graves: graves,
      graveNames: graves.map((g) => '墓地 · ' + g.name),
      graveIndex: graveIndex,
      date: date,
      dateLabel: '今天',
    })
  },
  onGrave(e) {
    this.setData({ graveIndex: Number(e.detail.value) })
  },
  onDate(e) {
    const date = e.detail.value
    this.setData({
      date: date,
      dateLabel: date === todayISO() ? '今天' : date,
    })
  },
  onTitle(e) { this.setData({ title: e.detail.value }) },
  onBody(e) { this.setData({ body: e.detail.value }) },
  toggleList() { this.setData({ openList: !this.data.openList }) },
  addPhoto() {
    const remain = 6 - this.data.photos.length
    if (remain <= 0) return
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const next = (res.tempFiles || []).map((f) => f.tempFilePath)
        this.setData({ photos: this.data.photos.concat(next).slice(0, 6) })
      },
    })
  },
  publish() {
    const family = store.currentFamily()
    const user = store.currentUser()
    const grave = this.data.graves[this.data.graveIndex]
    if (!grave) {
      wx.showToast({ title: '请先添加墓地', icon: 'none' })
      return
    }
    const v = store.saveVisit({
      familyId: family.id,
      graveId: grave.id,
      date: this.data.date,
      title: this.data.title.trim() || this.data.dateLabel,
      body: this.data.body.trim(),
      tags: [],
      photos: this.data.photos,
      authorName: user.nickname,
    })
    if (this.data.openList) {
      const lists = store.familyChecklists(family.id)
      if (lists[0]) {
        wx.redirectTo({ url: '/pages/checklist/checklist?id=' + lists[0].id })
        return
      }
    }
    wx.redirectTo({ url: '/pages/visit-detail/visit-detail?id=' + v.id })
  },
})
