# 从 Netlify 迁移到 Cloudflare Pages — 操作清单

> 迁移日期: 2026-06-16
> 状态: 代码变更已完成，等待线上配置

---

## 已完成的代码变更

### 新增文件
| 文件 | 用途 |
|------|------|
| `wrangler.toml` | Cloudflare Pages 配置（变量定义） |
| `DEPLOYMENT_CLOUDFLARE.md` | 完整的 Cloudflare 部署指南 |
| `.github/workflows/deploy.yml` | GitHub Actions 构建验证 |
| `scripts/test-cloudflare-build.js` | 本地构建验证脚本 |
| `public/_redirects` | SPA fallback 重定向（standalone 安全兜底） |

### 修改文件
| 文件 | 变更内容 |
|------|----------|
| `package.json` | 添加 `build:verify` 脚本，移除 SQLite 相关依赖 |
| `next.config.ts` | 添加 `output: 'standalone'` 和 Edge 兼容性配置 |
| `.gitignore` | 添加 `.wrangler/`、`.pages-output/`，更新 Netlify 注释 |
| `MONETIZATION_DECISION_LOGIC.md` | 更新技术栈描述、部署配置、环境变量位置 |
| `MONETIZATION_PLAN.md` | 更新平台描述为 Cloudflare Pages |

### 未修改文件
| 文件 | 原因 |
|------|------|
| `src/middleware.ts` | Cloudflare Pages Node.js runtime 完全兼容 |
| `src/lib/db.ts` | 使用 `pg` 适配器，兼容 Cloudflare |
| `src/lib/auth.ts` | 使用 `bcryptjs`（非 `@node-rs/bcrypt`），兼容 |
| `seed_db3.js` | 不需要改动，Prisma client 兼容 |

### 保留文件（暂不删除）
| 文件 | 说明 |
|------|------|
| `netlify.toml` | 保留作为参考，确认可在需要时回滚 |
| `.netlify/` | Netlify 构建缓存，已在 `.gitignore` 中 |

---

## 需要在 Cloudflare 后台完成的操作

### 1. 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **Overview** → **Create application** → **Pages**
3. 选择 **Connect to Git**
4. 授权 GitHub 并选择 `ai-tool-navigator` 仓库
5. 填写项目设置：

```
Project name: heyaihub
Production branch: master
Framework preset: Next.js (or "Other")
Build command: npx prisma generate && node seed_db3.js && npm run build
Build output directory: .next
```

### 2. 配置环境变量

在 **Settings** → **Environment variables** 中添加：

**生产变量（PUBLIC_ 开头）：**
| 变量名 | 值 |
|--------|-----|
| `NEXT_PUBLIC_SITE_URL` | `https://heyaihub.com` |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | `pub-8677289489236814` |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX`（你的 GA4 追踪 ID） |

**敏感变量（SECRET_ 开头）：**
| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | Neon PostgreSQL 连接字符串 |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | 管理员密码明文 |
| `ADMIN_SALT` | 64 字符随机字符串 |

### 3. 配置域名

1. **Custom domains** → **Set up a custom domain**
2. 输入 `heyaihub.com`
3. 确认 DNS 记录已正确配置

### 4. 首次部署

1. 推送当前代码到 GitHub `master` 分支
2. Cloudflare 自动触发构建
3. 在 **Deployments** 查看构建日志
4. 构建成功后验证网站

---

## 部署后验证清单

- [ ] 网站可正常访问 `https://heyaihub.com`
- [ ] 所有工具详情页可正常打开
- [ ] 搜索功能正常工作
- [ ] 博客/对比页面可访问
- [ ] Admin 后台可登录
- [ ] Newsletter 订阅表单提交成功
- [ ] AdSense 广告正常加载（需要 Google 批准）
- [ ] `https://heyaihub.com/ads.txt` 可访问
- [ ] `https://heyaihub.com/sitemap.xml` 包含所有页面
- [ ] Google Search Console 重新提交 sitemap

---

## 回滚步骤

如需回滚到 Netlify：

```bash
# 1. 恢复 netlify.toml
git checkout HEAD -- netlify.toml

# 2. 恢复 package.json（加回 SQLite 依赖）
git checkout HEAD -- package.json

# 3. 恢复 next.config.ts
git checkout HEAD -- next.config.ts

# 4. 恢复 MONETIZATION_PLAN.md 和 DECISION_LOGIC.md
git checkout HEAD -- MONETIZATION_PLAN.md MONETIZATION_DECISION_LOGIC.md

# 5. 删除 Cloudflare 相关文件
rm -rf .github/workflows/deploy.yml
rm wrangler.toml
rm DEPLOYMENT_CLOUDFLARE.md
rm scripts/test-cloudflare-build.js
rm public/_redirects

# 6. 在 Netlify 后台重新连接仓库并部署
```

---

## 注意事项

1. **Neon 数据库**：Cloudflare Pages 的 Node.js runtime 通过 HTTP 连接 Neon，与 Netlify 相同，无需额外配置
2. **Middleware**：Cloudflare Pages 的 Next.js standalone 输出中，middleware 被转换为 Node.js 中间件，完全兼容
3. **API Routes**：`output: 'standalone'` 会自动导出所有 API 路由到 standalone 输出
4. **构建体积**：standalone 模式会比全量构建小很多，适合 Cloudflare 的部署限制
5. **Prisma + pg 适配器**：本项目直接使用 `pg` 驱动连接 Neon，不需要 Prisma 特殊适配器

---

## 依赖变更说明

以下依赖已移除（仅在本地 PostgreSQL 开发时使用）：
- `@prisma/adapter-better-sqlite3` — SQLite 适配器，生产环境不用
- `better-sqlite3` — SQLite 引擎，生产环境不用
- `@types/better-sqlite3` — SQLite 类型定义

生产环境只使用 `pg` 适配器连接 Neon PostgreSQL，这些不需要包含在部署包中。
