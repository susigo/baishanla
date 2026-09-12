# 拜山啦 · 微信小程序原型

原生微信小程序（WXML / WXSS / JS）。数据在本机 `wx.setStorage`，**不是 H5**。

**Slogan：** 把看望，轻轻记下来

Repo：https://github.com/susigo/baishanla  
目录：仓库根下的 `miniprogram/`（`web/` 仅作 H5 参考）

验收标尺见仓库根 `商业产品验收条.md`：不以「点得开」为完成，而以「认真过清明的家庭会不会留下并拉家人」为准。

## 在微信开发者工具里打开

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. **导入项目**，目录选本仓库的 `miniprogram`（含 `app.json` / `project.config.json`）。
3. AppID：`project.config.json` 已写入团队 AppID；真机预览需把体验者加到该小程序。
4. 基础库 **2.32+ / 3.x**（配置为 `3.8.0`）。

打开的必须是 `miniprogram/`，不要打开仓库根或 `web/`。

## 真机主路径（请按此验收）

种子家庭：**小林家**。邀请码：`INVITE-XIAOLIN`。

最快：欢迎页 **进入演示 · 小林家**。

| 路径 | 应看到的深度 |
|---|---|
| 首页 | 「下一场拜山」按年循环算对（过了清明会滚到明年；当前种子下一场为重阳）；物资进度；最近记录 |
| 墓地 | 列表春山封面（非灰块）；编辑可 **相册/拍照封面**、**wx.chooseLocation 选点**；详情 **wx.openLocation 导航** |
| 记一笔 | 选墓地、日期、多图（自动压缩，最多 9 张）；发布后进按年时间线；可编辑/删除（编辑角色） |
| 清单 | 模板→本次克隆；勾选记录谁/何时；增删改；从模板重置；进度回首页 |
| 排程 | 清明/重阳/忌日/自定义；可选提醒日；新建时可同时生成清单 |
| 成员 | `open-type=share` 邀请卡片带邀请码；所有者可改角色/移除 |
| 我的 | 多家庭切换、退出干净、关于与隐私 |

底部 Tab 恰好 4 个：**首页 / 墓地 / 记录 / 我的**。

## 分享与订阅

- 分享：成员页「邀请家人」；路径 `/pages/family/family?invite=TOKEN`；封面 `assets/cover-sage.png`
- 订阅：`utils/subscribe.js` 的 `TMPL_IDS` 默认为空 → 演示 UI；填正式模板 ID 后真机可授权

## 本机数据

- `baishanla.db.v2`（兼容迁移 `v1`）
- `baishanla.pendingInvite` / `baishanla.subscribeOptIn`
- 「我的 → 重置演示数据」恢复种子

## 已知限制（下个迭代，UI/协议位已留）

- 正式 `code2session` / 服务端会话与邀请校验
- 订阅消息模板真推送
- 照片对象存储 CDN（现为本地临时路径）
- 短视频入库策略本期明确不做

## 颜色

Cream `#F7F3EA` · Sage `#7BAF9E` · Blush `#E7B8B0` · Ink `#2F3A36` · Muted `#6B776F` · Border `#E5E0D4`

空状态用春山 / 新芽渐变，不用灰盒子。

**不要把 AppSecret 提交进仓库。**
