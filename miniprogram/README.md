# 拜山啦 · 微信小程序原型

原生微信小程序（WXML / WXSS / JS），可点的清明春意原型。数据在本机 `wx.setStorage`，**不是 H5**。

**Slogan：** 把看望，轻轻记下来

Repo：https://github.com/susigo/baishanla  
目录：仓库根下的 `miniprogram/`（`web/` 仅作 H5 参考，不要当本原型打开）

## 在微信开发者工具里打开

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（稳定版即可）。
2. 用 git 拉下本仓库，或只关心小程序时进入 `miniprogram/`。
3. 打开开发者工具 → **导入项目**（不要选「小程序·云开发」模板）：
   - **目录**：选本仓库的 `miniprogram` 文件夹（里面有 `app.json` 和 `project.config.json`）。
   - **AppID**：见下一节。
   - **项目名称**：拜山啦 / `baishanla`。
4. 基础库选 **2.32+ / 3.x**（`project.config.json` 写的是 `3.8.0`，没有就选工具里最新）。
5. 模拟器出现欢迎页即可点。

打开的必须是 `miniprogram/`，不要打开仓库根或 `web/`。

## 如何填写 AppID

`project.config.json` 里现在是占位：

```json
"appid": "touristappid"
```

| 场景 | AppID | 说明 |
|---|---|---|
| 仅电脑模拟器点原型 | `touristappid` 或留空后勾选「使用测试号」 | 不需要注册小程序 |
| **手机扫码预览 / 真机调试** | 你自己的正式 AppID | `touristappid` **不能**出预览码给真机 |
| **真实订阅消息授权** | 正式 AppID + 公众平台模板 | 见下方「订阅提醒」 |

Eva 要在手机上看，需要：

1. 用微信登录 [微信公众平台](https://mp.weixin.qq.com/) → 注册 / 选择一个**小程序**账号。
2. 开发 → 开发管理 → 开发设置，复制 **AppID**。
3. 把 `miniprogram/project.config.json` 的 `appid` 改成该值（或在开发者工具「详情 → 基本信息」里改）。
4. 把 Eva 的微信号加到该小程序的 **开发者 / 体验成员**。
5. 开发者工具点 **预览**，用微信扫码。

不要把真实 AppID 提交进 git。`project.private.config.json` 可留给本机覆盖。

本原型**没有**后端 `code2session`，登录按钮只写本地 session。

## 演示怎么走

种子家庭：**小林家**。邀请码：`INVITE-XIAOLIN`。

### 最快：看已有数据

欢迎页或登录页点 **进入演示 · 小林家**  
→ 以成员「我」进入，带 2 座墓地、清明排程、物资清单、3 条记录。

### 微信登录（占位）

1. 欢迎页点绿色 **微信登录**（或登录页 **微信一键登录**）。
2. 不调真实微信授权，本地写入用户「微信用户」。
3. 若还没有家庭 → **家庭空间**：创建，或加入时填 `INVITE-XIAOLIN`。
4. 进入首页 Tab。

### 手机号（可选占位）

任意手机号，验证码 **`123456`**。已在种子里的号会进对应成员；新号没有家庭，走创建 / 加入。

### 建议点这些

- **首页**：下一场清明、记一笔、物资进度、最近记录；「看排程 / 开启提醒」进排程（排程不占 Tab）。右上角或系统分享可发家庭卡片。
- **墓地**：列表封面 → 详情 → 导航 / 记一笔 / 清单 / 更多（排程、编辑）。
- **记录**：按年分组 → 详情；记一笔（选墓地、日期、图）。
- **我的**：家庭、成员与邀请（**邀请家人**走微信分享卡片，复制邀请码仍可用）、退出、重置演示数据。

底部 Tab 恰好 4 个：**首页 / 墓地 / 记录 / 我的**。

## 分享卡片（已接通 · 无服务端校验）

成员页主按钮是原生 `button` + `open-type="share"`「邀请家人」。首页、墓地详情、记录详情、欢迎页也实现了 `onShareAppMessage`（以及 `onShareTimeline` 占位）。

- 标题示例：`来小林家一起记看望`
- 路径：`/pages/family/family?invite=TOKEN`（小林家为 `INVITE-XIAOLIN`）
- 封面：`assets/cover-sage.png`

家庭页会读取 `invite` 查询并预填加入码；未登录时先写入本地 `baishanla.pendingInvite`，登录后再回到家庭页。复制邀请码仍是次要入口。

**没有**服务端邀请校验，任何知道码的人都可以在本机加入种子家庭。

## 订阅提醒（表现层）

排程页（及首页下一场卡片上的「开启提醒」）是春意订阅卡，说明清明前提醒（提前 7 / 3 / 1 天）以及用户选择接收的内容。

点「开启清明提醒」会调用 `wx.requestSubscribeMessage`，模板 ID 集中在 `utils/subscribe.js` 的 `TMPL_IDS`（默认 `[]`）。

- `touristappid` / 未配置模板 / 调用失败：弹出说明「开发者工具 / 未配置模板时仅演示 UI；正式版配置模板 ID 后即可授权」，并在本地记下 `subscribeOptIn`，卡片变为「已预约提醒（演示）」。
- **真机授权**：用正式 AppID，在公众平台申请订阅消息模板，把模板 ID 填进 `TMPL_IDS`，再在真机点一次授权。不要把真实 AppID / 模板 ID 提交进 git。

重置演示数据会清掉订阅演示状态。

## 本机数据

- Key：`baishanla.db.v1`（`wx.setStorageSync`）
- 分享待加入：`baishanla.pendingInvite`
- 订阅演示：`baishanla.subscribeOptIn`
- 「我的 → 重置演示数据」恢复小林家种子并回到欢迎页
- 开发者工具：清缓存 Storage 也可重置

## 有意做成占位、未接真实能力

- 微信登录：无 `code2session`、无 unionId
- 地图：编辑页是春意网格 + 经纬度；详情「导航」走 `wx.openLocation`（不要地图 SDK key）
- 订阅消息：表现层已接通；`TMPL_IDS` 为空时只演示 UI，无真实推送
- 邀请：分享卡片已接线到家庭页预填；无服务端校验

## 颜色

Cream `#F7F3EA` · Sage `#7BAF9E` · Blush `#E7B8B0` · Ink `#2F3A36` · Muted `#6B776F` · Border `#E5E0D4`

空状态用春山 / 新芽渐变，不用灰盒子。按钮为胶囊，卡片圆角约 16px。

## 目录

```
miniprogram/
  app.js / app.json / app.wxss
  project.config.json          # appid: touristappid
  pages/                       # 欢迎、登录、家庭、四个 Tab、详情与表单
  components/                  # hills-art · empty-state · cover-thumb
  utils/store.js               # 种子数据与 CRUD
  utils/share.js               # 分享卡片 title/path/imageUrl
  utils/subscribe.js           # TMPL_IDS 与 requestSubscribeMessage
  assets/tabs/                 # tabBar 图标
```
