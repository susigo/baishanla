/**
 * Persist temp media into the mini-program user data dir so covers/photos
 * survive relaunch (wx.chooseMedia temp paths do not).
 * Formal CDN upload remains a next-iteration slot (see README).
 */
function persistLocalFile(tempPath) {
  return new Promise((resolve) => {
    if (!tempPath) {
      resolve('')
      return
    }
    try {
      const root = (wx.env && wx.env.USER_DATA_PATH) || ''
      if (root && String(tempPath).indexOf(root) === 0) {
        resolve(tempPath)
        return
      }
    } catch (e) {
      /* ignore */
    }

    const fsm = typeof wx.getFileSystemManager === 'function' ? wx.getFileSystemManager() : null
    const root = (wx.env && wx.env.USER_DATA_PATH) || ''
    if (fsm && root) {
      const m = String(tempPath).match(/\.[a-zA-Z0-9]{1,8}(?:\?|$)/)
      const ext = m ? m[0].replace(/\?.*$/, '') : '.jpg'
      const dest =
        root +
        '/bs_' +
        Date.now().toString(36) +
        '_' +
        Math.random().toString(36).slice(2, 8) +
        ext
      try {
        fsm.copyFile({
          srcPath: tempPath,
          destPath: dest,
          success: () => resolve(dest),
          fail: () => fallbackSave(tempPath, resolve),
        })
        return
      } catch (e) {
        /* fall through */
      }
    }
    fallbackSave(tempPath, resolve)
  })
}

function fallbackSave(tempPath, resolve) {
  if (typeof wx.saveFile === 'function') {
    wx.saveFile({
      tempFilePath: tempPath,
      success: (r) => resolve((r && r.savedFilePath) || tempPath),
      fail: () => resolve(tempPath),
    })
    return
  }
  resolve(tempPath)
}

function persistMany(paths) {
  const list = paths || []
  return list.reduce(
    (p, src) =>
      p.then(async (acc) => {
        acc.push(await persistLocalFile(src))
        return acc
      }),
    Promise.resolve([]),
  )
}

module.exports = { persistLocalFile, persistMany }
