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

- **首页**：下一场清明、记一笔、物资进度、最近记录；「看排程」进排程（排程不占 Tab）。
- **墓地**：列表封面 → 详情 → 导航（`wx.openLocation`）/ 记一笔 / 清单 / 排程 → 编辑。
- **记录**：按年分组 → 详情；记一笔（选墓地、日期、图）。
- **我的**：家庭、成员与邀请（复制邀请码）、退出、重置演示数据。

底部 Tab 恰好 4 个：**首页 / 墓地 / 记录 / 我的**。

## 本机数据

- Key：`baishanla.db.v1`（`wx.setStorageSync`）
- 「我的 → 重置演示数据」恢复小林家种子并回到欢迎页
- 开发者工具：清缓存 Storage 也可重置

## 有意做成占位、未接真实能力

- 微信登录：无 `code2session`、无 unionId
- 地图：编辑页是春意网格 + 经纬度；详情「导航」走 `wx.openLocation`（不要地图 SDK key）
- 订阅消息：排程页「订阅提醒（占位）」只弹说明，无模板 ID
- 邀请：复制邀请码；无正式分享卡片

## 颜色

Cream `#F7F3EA` · Sage `#7BAF9E` · Blush `#E7B8B0` · Ink `#2F3A36`

空状态用春山 / 新芽渐变，不用灰盒子。

## 目录

```
miniprogram/
  app.js / app.json / app.wxss
  project.config.json          # appid: touristappid
  pages/                       # 欢迎、登录、家庭、四个 Tab、详情与表单
  components/                  # hills-art · empty-state · cover-thumb
  utils/store.js               # 种子数据与 CRUD
  assets/tabs/                 # tabBar 图标
```
