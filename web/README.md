# 拜山啦 · Web MVP

中文手机优先 H5 / PWA 演示：墓地、拜山记录、排程、物资清单、家庭协作。

**Slogan：** 把看望，轻轻记下来

## Preview

**Public HTTPS：** https://baishanla-eva.surge.sh

（若链接暂不可用，见下方本地运行。）

## Repo

https://github.com/susigo/baishanla

## Stack

- React 19 + Vite + TypeScript + Tailwind CSS v4 + React Router
- Persistence: `localStorage` single demo DB
- Demo OTP: any phone, code `123456`
- Seed family: **小林家**（可点「进入演示」）

## Local

```bash
cd web
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## What works

- Welcome / Login / Onboarding（创建或加入家庭）
- 首页摘要：下一场排程、记一笔、物资进度、最近记录
- 墓地列表 / 新建 / 详情 / 编辑；地图占位；导航打开高德 URL
- 记录时间线 / 新建（图片 file → dataURL/objectURL）/ 详情
- 排程列表与新建（从首页/墓地进入，无独立 Tab）
- 物资清单勾选、编辑项、从模板重置
- 我的 / 成员 / 复制邀请码
- 底部 Tab 恰好 4：首页 / 墓地 / 记录 / 我的

## Mocked / MVP limits

- 无真实短信；验证码固定 `123456`
- 地图为占位网格，经纬度可手改
- 无后端；数据仅本机 localStorage
- PWA：manifest + theme；未接完整 service worker
- 图片大文件用 object URL（刷新后可能丢失）；小图 base64 持久化

## Design tokens

Cream `#F7F3EA` · Sage `#7BAF9E` · Blush `#E7B8B0` · Ink `#2F3A36` · max content 390px
