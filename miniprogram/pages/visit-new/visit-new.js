const store = require('../../utils/store')
const auth = require('../../utils/auth')
const media = require('../../utils/media')
const { todayISO, formatMD } = require('../../utils/ids')

const MAX_PHOTOS = 9

function compressOne(src) {
  return new Promise((resolve) => {
    if (typeof wx.compressImage !== 'function') {
      resolve(src)
      return
    }
    wx.compressImage({
      src: src,
      quality: 72,
      success: (r) => resolve(r.tempFilePath || src),
      fail: () => resolve(src),
    })
  })
}

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
    publishing: false,
    canEdit: true,
    emptyGraves: false,
    editing: false,
  },
  onLoad(q) {
    if (!auth.requireFamily()) return
    this.editId = q.id || ''
    this.bootstrap(q.graveId)
  },
  onShow() {
    if (!auth.requireFamily()) return
  },
  bootstrap(graveId) {
    const family = store.currentFamily()
    const canEdit = store.canEditFamily(family.id)
    const graves = store.familyGraves(family.id)
    let graveIndex = 0
    if (graveId) {
      const idx = graves.findIndex((g) => g.id === graveId)
      if (idx >= 0) graveIndex = idx
    }
    const date = todayISO()
    const patch = {
      graves: graves,
      graveNames: graves.map((g) => '墓地 · ' + g.name),
      graveIndex: graveIndex,
      date: date,
      dateLabel: '今天',
      canEdit: canEdit,
      emptyGraves: !graves.length,
    }
    if (this.editId) {
      const v = store.getVisit(this.editId)
      if (v && store.belongsToFamily(v, family.id)) {
        const gi = Math.max(0, graves.findIndex((g) => g.id === v.graveId))
        patch.graveIndex = gi
        patch.date = v.date
        patch.dateLabel = v.date === todayISO() ? '今天' : formatMD(v.date)
        patch.title = v.title || ''
        patch.body = v.body || ''
        patch.photos = (v.photos || []).slice()
        patch.editing = true
        wx.setNavigationBarTitle({ title: '编辑记录' })
      } else if (v) {
        wx.showToast({ title: '记录不属于当前家庭', icon: 'none' })
        setTimeout(() => wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/visits/visits' }) }), 400)
        return
      }
    }
    this.setData(patch)
  },
  onGrave(e) {
    this.setData({ graveIndex: Number(e.detail.value) })
  },
  onDate(e) {
    const date = e.detail.value
    this.setData({
      date: date,
      dateLabel: date === todayISO() ? '今天' : formatMD(date),
    })
  },
  onTitle(e) {
    this.setData({ title: e.detail.value })
  },
  onBody(e) {
    this.setData({ body: e.detail.value })
  },
  toggleList() {
    this.setData({ openList: !this.data.openList })
  },
  addPhoto() {
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    const remain = MAX_PHOTOS - this.data.photos.length
    if (remain <= 0) {
      wx.showToast({ title: '最多 ' + MAX_PHOTOS + ' 张', icon: 'none' })
      return
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: async (res) => {
        wx.showLoading({ title: '压缩中', mask: true })
        const paths = (res.tempFiles || []).map((f) => f.tempFilePath)
        const out = []
        for (let i = 0; i < paths.length; i++) {
          const compressed = await compressOne(paths[i])
          out.push(await media.persistLocalFile(compressed))
        }
        wx.hideLoading()
        this.setData({ photos: this.data.photos.concat(out).slice(0, MAX_PHOTOS) })
      },
      fail: (err) => {
        const msg = (err && err.errMsg) || ''
        if (msg.indexOf('cancel') >= 0) return
        wx.showToast({ title: '选图失败', icon: 'none' })
      },
    })
  },
  previewPhoto(e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({ current: src, urls: this.data.photos })
  },
  removePhoto(e) {
    const idx = Number(e.currentTarget.dataset.idx)
    const photos = this.data.photos.slice()
    photos.splice(idx, 1)
    this.setData({ photos: photos })
  },
  goAddGrave() {
    wx.navigateTo({ url: '/pages/grave-edit/grave-edit?mode=new' })
  },
  publish() {
    if (this.data.publishing) return
    if (!this.data.canEdit) {
      wx.showToast({ title: '当前角色仅可查看', icon: 'none' })
      return
    }
    const family = store.currentFamily()
    const user = store.currentUser()
    const grave = this.data.graves[this.data.graveIndex]
    if (!grave) {
      wx.showToast({ title: '请先添加墓地', icon: 'none' })
      return
    }
    this.setData({ publishing: true })
    const payload = {
      id: this.editId || undefined,
      familyId: family.id,
      graveId: grave.id,
      date: this.data.date,
      title: this.data.title.trim() || this.data.dateLabel,
      body: this.data.body.trim(),
      tags: [],
      photos: this.data.photos,
      authorName: user.nickname,
    }
    const v = store.saveVisit(payload)
    if (!v) {
      this.setData({ publishing: false })
      wx.showToast({ title: '保存失败', icon: 'none' })
      return
    }
    if (this.data.openList) {
      let lists = store.familyChecklists(family.id).filter((c) => c.graveId === grave.id)
      if (!lists.length) lists = store.familyChecklists(family.id)
      if (lists[0]) {
        wx.redirectTo({ url: '/pages/checklist/checklist?id=' + lists[0].id })
        return
      }
      const tmpls = store.familyTemplates(family.id)
      if (tmpls[0]) {
        const list = store.cloneTemplateToChecklist({
          familyId: family.id,
          graveId: grave.id,
          templateId: tmpls[0].id,
          type: '物资',
        })
        if (list) {
          wx.redirectTo({ url: '/pages/checklist/checklist?id=' + list.id })
          return
        }
      }
    }
    // after publish → year-grouped timeline (记录 tab)
    wx.showToast({ title: this.editId ? '已保存' : '已发布', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/visits/visits' })
    }, 400)
  },
})
