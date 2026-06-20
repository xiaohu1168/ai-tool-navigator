# 变现功能实施总结

> 日期: 2026-06-19
> 依据: MONETIZATION_DECISION_LOGIC.md Section 9（待实施项追踪）

---

## 实施概览

根据运营决策文档，共三项待实施内容，全部已完成：

| 优先级 | 项目 | 状态 | 说明 |
|--------|------|------|------|
| **高** | 联盟链接填充 | ✅ 已完成 | Admin API + 管理 UI + 种子脚本 |
| **中** | Google Analytics 4 | ✅ 已完成 | 环境变量配置 + 联盟点击事件追踪 |
| **低** | Newsletter 对接 | ✅ 已验证 | API 路由已存在且完整，无需修改 |

---

## 1. 联盟链接填充（高优先级）

### 1.1 新增文件

#### `src/app/api/admin/affiliate-links/route.ts`

联盟链接 CRUD API 路由，复用现有的 `admin_token` cookie 认证机制。

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/admin/affiliate-links?toolId=<id>` | 查询指定工具的联盟链接列表 |
| GET | `/api/admin/affiliate-links` | 查询所有联盟链接（含关联工具名） |
| POST | `/api/admin/affiliate-links` | 创建新联盟链接（校验 tool_id/label/url） |
| PATCH | `/api/admin/affiliate-links?id=<id>` | 更新联盟链接（label/url/network） |
| DELETE | `/api/admin/affiliate-links?id=<id>` | 删除联盟链接 |

认证方式：从 cookie 提取 `admin_token`，调用 `verifyToken()` 验证。

#### `scripts/seed-affiliate-links.js`

批量种子脚本，为高价值工具创建联盟链接记录。

**覆盖工具：** Cursor、Windsurf、ChatGPT、Claude、Jasper、Midjourney、Canva、Runway、ElevenLabs、Notion

**特性：**
- 幂等安全：通过 `url + tool_id` 查重，跳过已存在的链接
- 容错：数据库不可用时输出日志而不崩溃
- 模板化：`AFFILIATE_TEMPLATES` 数组按分类组织，方便扩展

**使用方法：**
```bash
node scripts/seed-affiliate-links.js
```

#### `src/components/AffiliateLinkClickTracker.tsx`

客户端 GA4 事件追踪组件，注入到工具详情页。

**功能：** 监听联盟链接按钮点击，向 GA4 发送 `affiliate_click` 事件，携带：
- `affiliate_link_id` — 链接唯一 ID
- `affiliate_label` — 按钮文案（如 "Try ChatGPT Plus"）
- `affiliate_network` — 联盟网络（如 "Direct"、"Impact"）
- `tool_slug` — 工具 slug

### 1.2 修改文件

#### `src/components/admin/AdminTools.tsx`

在工具管理表格中新增联盟链接管理功能：

- **工具列表行**：新增「🔗 Manage Links」按钮（绿色图标），点击打开联盟链接管理对话框
- **管理对话框**：
  - 列表视图：显示所有联盟链接（label、network badge、click_count、URL 预览）
  - 操作：每条链接支持编辑（✏️）和删除（🗑️）
  - 新增表单：Label（必填）、URL（必填）、Network（选填，默认 "Direct"）
  - 空状态提示：无链接时显示引导文字

#### `src/app/tools/[slug]/page.tsx`

- 导入 `AffiliateLinkClickTracker` 组件
- 在联盟链接按钮上添加 `id="affiliate-link-{linkId}"` 供追踪组件定位
- 渲染 `<AffiliateLinkClickTracker links={affiliateLinks} toolSlug={slug} />`

---

## 2. Google Analytics 4（中优先级）

### 2.1 新增环境变量

#### `.env.local`（第 7 行）
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### `.env.production`（第 18-19 行）
```
# Google Analytics 4 — 替换为你的真实 Measurement ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> **⚠️ 重要：** 部署前需将 `G-XXXXXXXXXX` 替换为真实的 GA4 Measurement ID（格式为 `G-` 开头 10 位字符）。可在 https://analytics.google.com 创建。

### 2.2 已有基础设施（无需修改）

| 文件 | 功能 |
|------|------|
| `src/components/GoogleAnalytics.tsx` | 加载 gtag.js，监听 pathname 变化自动追踪页面浏览 |
| `src/app/layout.tsx` | 读取 `NEXT_PUBLIC_GA_ID`，条件渲染 `<GoogleAnalytics>` |

---

## 3. Newsletter（低优先级 — 已验证无需修改）

### 3.1 现有实现

| 文件 | 功能 |
|------|------|
| `src/components/layout/Footer.tsx` | 页脚 Newsletter 表单，POST 到 `/api/newsletter` |
| `src/app/api/newsletter/route.ts` | API 路由：Zod 邮箱验证 + 防重复订阅 + 返回 201/200/400/500 |
| `prisma/schema.prisma` | `NewsletterSubscriber` 模型（email 唯一索引） |

### 3.2 结论

功能完整，无需任何修改。如需添加确认邮件功能，可在 API 路由中集成 Resend/SendGrid。

---

## 文件变更清单

| 操作 | 文件路径 |
|------|----------|
| **新建** | `src/app/api/admin/affiliate-links/route.ts` |
| **新建** | `scripts/seed-affiliate-links.js` |
| **新建** | `src/components/AffiliateLinkClickTracker.tsx` |
| **修改** | `src/components/admin/AdminTools.tsx` |
| **修改** | `src/app/tools/[slug]/page.tsx` |
| **修改** | `.env.local` |
| **修改** | `.env.production` |
| **修改** | `MONETIZATION_DECISION_LOGIC.md` |

---

## 技术细节补充

### 认证流程

所有联盟链接管理操作复用现有的 `admin_token` cookie 认证：

1. 用户登录 `/api/auth/login` → 设置 `admin_token` cookie（7 天有效期，HttpOnly，SameSite=Lax）
2. AdminTools 组件通过 `fetch(url, { credentials: "include" })` 发送请求
3. API 路由从 cookie 提取 token，调用 `verifyToken()` 验证 HMAC-SHA256 签名
4. 验证通过后执行数据库操作

### 数据流

```
Admin 面板 (AdminTools.tsx)
  ├── 点击 🔗 Manage Links
  ├── GET /api/admin/affiliate-links?toolId=<id>
  ├── 加载 AffiliateLink 列表
  ├── 点击 Add/Edit/Delete
  ├── POST/PATCH/DELETE /api/admin/affiliate-links
  └── 自动刷新列表

工具详情页 (tools/[slug]/page.tsx)
  ├── GET /api/track/affiliate?linkId=<id>
  ├── 用户点击联盟链接按钮
  ├── trackAffiliateClick() → 递增 click_count
  ├── 302 重定向到联盟 URL
  └── AffiliateLinkClickTracker → gtag('event', 'affiliate_click')

部署流水线 (seed_db3.js)
  ├── 1. 导入/更新 categories
  ├── 2. 导入/更新 tools (upsert)
  ├── 3. 更新 category counts
  └── 4. 调用 seed-affiliate-links.js 导入联盟链接（best-effort，失败不阻塞构建）
```

### 幂等保证

- `seed-affiliate-links.js` 通过 `(tool_id, url)` 唯一键查重，重复运行不会创建重复记录
- `seed_db3.js` 对 Tool 和 Category 使用 `upsert`，已有幂等保证
- `seed_affiliate_links.js` 接受可选的 prisma client 参数，可独立运行或被 `seed_db3.js` 调用
- 联盟链接种子脚本在数据库不可用时优雅降级（输出日志，不崩溃）

---

## 后续操作建议

1. **替换 GA4 Measurement ID** — 在 `.env.production` 中将 `G-XXXXXXXXXX` 替换为真实 ID，并在 Netlify 后台同步设置
2. **运行种子脚本** — `node scripts/seed-affiliate-links.js` 填充联盟链接数据
3. **替换真实联盟链接 URL** — 种子脚本中的 URL 为占位符（含 `?via=heyaihub`），需替换为实际的联盟追踪链接
4. **在 Google Search Console 提交 sitemap** — 确保新页面被收录
5. **监控 GA4 数据** — 确认页面浏览和联盟点击事件正常上报
