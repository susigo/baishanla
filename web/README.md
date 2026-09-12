# 拜山啦 · Web MVP

中文手机优先 H5 / PWA 演示：墓地、拜山记录、排程、物资清单、家庭协作。

**Slogan：** 把看望，轻轻记下来

## Preview（验证 URL）

**Public HTTPS：** https://susigo.github.io/baishanla/

（Hash 路由，打开后为 `#/welcome`；可点「进入演示 · 小林家」。）

Repo：https://github.com/susigo/baishanla

## Stack

- React 19 + Vite + TypeScript + Tailwind CSS v4 + React Router（HashRouter）
- Persistence: `localStorage` 单库演示
- Demo OTP: 任意手机号，验证码 `123456`
- Seed：家庭 **小林家**，2 座墓地、清明排程、物资清单、若干记录

## Local

```bash
cd web
npm install
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```

## What works

- `/welcome` `/login` `/onboarding`（创建 / 加入家庭）
- 首页：下一场排程、记一笔、物资进度、最近记录
- 墓地列表 / 新建 / 详情 / 编辑；地图占位；「导航」打开高德 URL
- 记录时间线 / 新建（图片 → dataURL 或 objectURL）/ 详情
- 排程列表与新建（仅从首页/墓地进入，无独立 Tab）
- 物资清单勾选、编辑、从模板重置
- 我的 / 成员 / 复制邀请码
- 底部 Tab 恰好 4：首页 / 墓地 / 记录 / 我的
- PWA manifest + theme-color（无完整 SW）

## Mocked

- 无真实短信；验证码固定 `123456`
- 地图为网格占位，经纬度可手改
- 无后端；数据仅本机 localStorage
- 大图用 object URL（刷新可能丢）；小图 base64 可持久化

## Design tokens

Cream `#F7F3EA` · Sage `#7BAF9E` · Blush `#E7B8B0` · Ink `#2F3A36` · max-width 390px
