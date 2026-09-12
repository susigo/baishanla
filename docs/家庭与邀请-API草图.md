# 拜山啦 · 家庭与邀请 API 草图

| 项 | 内容 |
|---|---|
| 文档 | BAISHANLA-BE-FAMILY-001 |
| 依赖 | [微信登录-code2session.md](./微信登录-code2session.md) |
| 版本 | B/0 |
| 日期 | 2026-09-12 |
| 状态 | 草图 · 对齐小程序分享卡片 |
| 非目标 | 聚家；公开广场；跨家庭资源拷贝 |

---

## 1. 角色（与产品一致）

| 角色 | 能力 |
|---|---|
| owner | 建/改家庭、邀请、改角色、移除、删家庭、移交 |
| editor | 读写墓地/记录/排程/清单/媒体；勾选清单 |
| viewer | 只读上述资源 |

默认邀请角色：**editor**。邀请人必须是 **owner**。

## 2. 小程序邀请形态

| 形态 | 实现要点 |
|---|---|
| 分享卡片 | `onShareAppMessage` → path `pages/join/index?token=<plain>` |
| 小程序码 | 可选；scene 带短 token 或 invite id（二期可补） |
| 群分享 | 同卡片；服务端按 `max_uses` / 过期控制 |

Token：**高熵随机串**（≥ 128 bit），URL 只带明文一次；库内只存 **SHA-256 hash**。

加入成功后：`wx.redirectTo` 首页，并设当前 `X-Family-Id`。

## 3. 表（摘要）

详见 [数据模型-小程序对齐.md](./数据模型-小程序对齐.md)：`families`、`family_members`、`family_invites`。

邀请默认：`expires_at = now+7d`，`max_uses = 10`（可在创建时覆盖为 1）。

## 4. API 一览

前缀 `/api/v1`。除注明外均需登录。

| Method | Path | 最小角色 | 说明 |
|---|---|---|---|
| GET | `/families` | — | 我加入的家庭列表 |
| POST | `/families` | — | 创建；调用者变 owner；自动设为当前家庭 |
| GET | `/families/{id}` | member | 详情 |
| PATCH | `/families/{id}` | owner | name / theme |
| DELETE | `/families/{id}` | owner | 软删；成员关系失效 |
| POST | `/families/{id}/transfer` | owner | `{ toUserId }` 移交 owner |
| GET | `/families/{id}/members` | member | |
| PATCH | `/families/{id}/members/{userId}` | owner | `{ role }`；不可降唯一 owner |
| DELETE | `/families/{id}/members/{userId}` | owner | 不可移除自己若是唯一 owner |
| POST | `/families/{id}/invites` | owner | 创建邀请；返回 **明文 token + 分享 path** |
| GET | `/families/{id}/invites` | owner | 未撤销列表（不含明文） |
| DELETE | `/families/{id}/invites/{inviteId}` | owner | 撤销 |
| GET | `/invites/preview?token=` | 可匿名 | 展示家庭名、邀请角色、是否仍有效（不泄露成员） |
| POST | `/families/join` | 登录 | `{ token }` 加入 |

请求头：`Authorization` + 业务接口可选 `X-Family-Id`（家庭域资源强制）。

## 5. 关键请求/响应

### POST `/families`

```json
// req
{ "name": "王家", "theme": "spring_qingming" }
// res.data
{ "id": "…", "name": "王家", "theme": "spring_qingming", "role": "owner" }
```

### POST `/families/{id}/invites`

```json
// req
{ "role": "editor", "maxUses": 10, "expiresInDays": 7 }
// res.data
{
  "inviteId": "…",
  "token": "<plain-once>",
  "role": "editor",
  "expiresAt": "2026-09-19T00:00:00Z",
  "maxUses": 10,
  "share": {
    "title": "来「王家」一起拜山啦",
    "path": "/pages/join/index?token=<plain-once>"
  }
}
```

> 明文 token **只在创建响应出现一次**。列表接口只回 `inviteId`、角色、过期、已用次数、状态。

### GET `/invites/preview?token=`

```json
{
  "familyName": "王家",
  "role": "editor",
  "valid": true,
  "reason": null
}
```

`valid=false` 时 `reason`: `EXPIRED` | `REVOKED` | `EXHAUSTED` | `NOT_FOUND`。

### POST `/families/join`

```json
// req
{ "token": "…" }
// res.data
{ "familyId": "…", "name": "王家", "role": "editor" }
```

幂等：已是成员 → `200` 返回当前角色，不占 `used_count`。

## 6. 错误码

| code | HTTP | 场景 |
|---|---|---|
| `FAMILY_REQUIRED` | 409 | 多家庭未带 `X-Family-Id` |
| `FORBIDDEN` | 403 | 角色不足 |
| `INVITE_EXPIRED` | 410 | 过期 |
| `INVITE_REVOKED` | 410 | 已撤销 |
| `INVITE_EXHAUSTED` | 410 | 次数用尽 |
| `ALREADY_MEMBER` | 200/409 | 建议幂等 200 |
| `LAST_OWNER` | 409 | 不能移除/降级唯一 owner |
| `NOT_FOUND` | 404 | |

## 7. 权限中间件约定

```
RequireLogin
RequireFamilyMember(familyId)      // 读
RequireFamilyRole(familyId, owner) // 邀请/改角色等
```

所有查询强制 `family_id` 隔离，禁止仅凭资源 id 跨家庭访问（防 IDOR）。

## 8. 小程序页面映射

| 页面 | 调接口 |
|---|---|
| B1 创建/加入 | `POST /families`；`GET /invites/preview` + `POST /families/join` |
| B2 家庭切换 | `GET /families`；本地存 currentFamilyId |
| B3 成员与邀请 | members CRUD；`POST .../invites` 后调 `wx.shareAppMessage` / 展示 path |
| 启动分享落地 | 解析 query.token → preview → 未登录先微信登录再 join |

## 9. Mock → 真 API 切换

前端 storage mock 阶段建议本地对象形状与 `res.data` 一致，字段名用 camelCase。真 API 就绪后只换 `lib/api` baseURL 与鉴权头，不改页面状态机。

## 10. 落地顺序（脚手架后）

1. families + members 表与 CRUD  
2. invites 创建 / preview / join  
3. transfer + 软删  
4. 与前端联调分享 path  
