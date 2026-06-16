# Cloudflare Pages 部署指南

> 从 Netlify 迁移到 Cloudflare Pages 的完整步骤

## 前置条件

1. 拥有 Cloudflare 账户（免费计划足够）
2. Neon PostgreSQL 数据库已配置（HTTP 模式）
3. GitHub 仓库已就绪

## 部署步骤

### 1. Cloudflare 后台配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Overview** → **Create application** → **Pages**
3. 选择 **Connect to Git** → 选择你的 GitHub 仓库
4. 填写项目设置：
   - **Project name**: `heyaihub`
   - **Production branch**: `master`
   - **Framework preset**: `Next.js`（或者选择 `Other`）
   - **Build command**: `npx prisma generate && node seed_db3.js && npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: （留空，如果是根目录项目）

### 2. 环境变量配置

在 Cloudflare Pages 的 **Settings** → **Environment variables** 中添加：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | Neon PostgreSQL 连接字符串（敏感） | `postgresql://neondb_owner:...@...` |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | `https://heyaihub.com` |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | AdSense 发布商 ID | `pub-8677289489236814` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 追踪 ID | `G-XXXXXXXXXX` |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码（明文，哈希在代码中完成） | — |
| `ADMIN_SALT` | JWT 签名密钥 | 64字符随机字符串 |

**注意**：
- 以 `NEXT_PUBLIC_` 开头的变量会编译到客户端代码
- `DATABASE_URL`、`ADMIN_PASSWORD`、`ADMIN_SALT` **不要**勾选 "Enable Deployment Protection" 外的公开访问

### 3. 域名配置

1. 在 Cloudflare Pages 项目的 **Custom domains** 中添加 `heyaihub.com`
2. 确保你的域名 DNS 已托管在 Cloudflare（或在 Cloudflare 中添加 DNS 记录）
3. 配置 CNAME 或 A 记录指向 Cloudflare Pages 提供的 URL

### 4. 首次部署

1. 推送代码到 GitHub `master` 分支
2. Cloudflare 会自动触发构建
3. 在 **Deployments** 页面查看构建日志
4. 构建成功后访问 `https://heyaihub.com`

## 环境变量迁移对照表

| 环境变量 | Netlify 位置 | Cloudflare 位置 |
|----------|-------------|-----------------|
| `DATABASE_URL` | Netlify Settings → Environment Variables | Pages Settings → Environment Variables |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | Netlify Settings → Environment Variables | Pages Settings → Environment Variables |
| `ADMIN_SALT` | Netlify Settings → Environment Variables | Pages Settings → Environment Variables |
| `NEXT_PUBLIC_SITE_URL` | `.env.production` 文件 | Pages Settings → Environment Variables |
| `NEXT_PUBLIC_GA_ID` | 缺失，需添加 | Pages Settings → Environment Variables |

## 与 Netlify 的主要差异

| 特性 | Netlify | Cloudflare Pages |
|------|---------|-----------------|
| 构建命令 | `netlify.toml` | 后台配置或 `wrangler.toml` |
| 重定向 | `netlify.toml` redirects | `_redirects` 文件或后台配置 |
| 环境变量 | Netlify 后台 | Pages 后台 |
| 边缘函数 | Edge Functions | Pages 默认支持 Edge Runtime |
| 定价 | 按带宽和构建分钟 | 免费计划更慷慨 |

## 重定向配置

如果网站有客户端路由（SPA fallback），Cloudflare Pages 需要 `_redirects` 文件：

```
# .next/static/*  /  200
/*  /index.html  200
```

**注意**：Next.js standalone 模式会自动处理大部分路由，通常不需要额外重定向。
API 路由和静态文件通过 `output: 'standalone'` 正确导出。

## 故障排查

### 构建失败：Prisma 编译错误
- 确认 `DATABASE_URL` 正确配置
- 确认使用 Node.js runtime（不是 Edge runtime）
- 检查 `npx prisma generate` 是否成功

### 数据库连接失败
- 确认 Neon 数据库允许 Cloudflare IP 访问
- 检查 `DATABASE_URL` 是否使用 `sslmode=require`
- 验证 Neon 项目的连接字符串是否正确

### API 路由 404
- 确认 `output: 'standalone'` 已配置
- 检查 `_redirects` 文件（如果有的话）
- 确认 API 路由文件在正确的位置

## 回滚到 Netlify

如需回滚：
1. 在 Netlify 后台重新配置环境变量
2. 从 `.env.production` 文件读取配置
3. 删除 `wrangler.toml` 和 `.github/workflows/deploy.yml`
4. 恢复 `netlify.toml`
5. 重新推送触发部署

## 本地测试 Cloudflare 部署

```bash
# 安装 wrangler CLI
npm install -g wrangler

# 预览构建结果
npx prisma generate
node seed_db3.js
npm run build

# 本地验证 standalone 输出
node .next/standalone/server.js
```
