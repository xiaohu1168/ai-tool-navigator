# Hey AI Hub - AI 工具导航站

一个基于 Next.js 的 AI 工具导航和对比平台，使用 PostgreSQL 数据库。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置数据库

#### 选项 A: 使用 Neon 免费 PostgreSQL (推荐)
1. 访问 https://neon.tech 创建免费账户
2. 创建新项目并获取连接字符串
3. 运行配置助手:
   ```bash
   .\setup-neon.ps1
   ```

#### 选项 B: 本地 PostgreSQL
1. 安装 PostgreSQL: https://www.postgresql.org/download/
2. 创建数据库:
   ```bash
   createdb heyaihub
   ```
3. 运行配置助手:
   ```bash
   .\config-postgres.ps1
   ```

#### 选项 C: 临时使用 SQLite (开发测试)
修改 `.env.local` 中的 DATABASE_URL:
```
DATABASE_URL="file:./dev.db"
```
并修改 `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. 初始化数据库
```bash
npx prisma db push
```

### 4. 启动开发服务器
```bash
npm run dev
```

打开 http://localhost:3000 查看应用。

## 📁 项目结构
```
src/
├── app/           # Next.js 页面和 API 路由
├── components/    # React 组件
├── lib/           # 数据库和工具函数
└── prisma/        # Prisma 模式
```

## 🔧 技术栈
- **框架**: Next.js 16
- **数据库**: PostgreSQL (使用 Prisma ORM)
- **UI**: Tailwind CSS + shadcn/ui
- **图标**: Lucide React

## 🛠 可用脚本
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npx prisma db push` - 同步数据库模式
- `npx prisma generate` - 生成 Prisma 客户端

## 📖 文档
- [数据库配置指南](./DATABASE_SETUP_GUIDE.md)
- [Neon 配置助手](./setup-neon.ps1)
- [PostgreSQL 配置脚本](./config-postgres.ps1)

## 🚀 部署
本项目支持 Netlify 部署。确保在生产环境中正确设置 `DATABASE_URL` 环境变量。