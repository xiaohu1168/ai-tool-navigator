# PostgreSQL 数据库配置指南

## 方案 1：使用 Neon 免费 PostgreSQL（推荐）

### 步骤 1：创建 Neon 账户
1. 访问 https://neon.tech
2. 使用 GitHub 或 Google 登录
3. 创建新项目

### 步骤 2：获取数据库连接字符串
1. 在项目 Dashboard 中，点击 "Connection Details"
2. 复制 "Authenticating from an app" 下的连接字符串
3. 示例格式：
   postgresql://username:password@ep-xxxxx.region-1.aws.neon.tech/dbname?sslmode=require

### 步骤 3：更新 .env.local
在文件中替换 DATABASE_URL 为您的实际连接字符串：
```
DATABASE_URL=postgresql://your-user:your-password@ep-xxxxx.region-1.aws.neon.tech/your-db-name?sslmode=require
```

### 步骤 4：应用数据库迁移
运行以下命令创建表结构：
```bash
npx prisma db push
```

### 步骤 5：验证连接
```bash
npx prisma db execute --url "你的连接字符串" --schema ./prisma/schema.prisma
```

---

## 方案 2：本地安装 PostgreSQL

### Windows 安装步骤
1. 从 https://www.enterprisedb.com/downloads/postgres-postgresql-downloads 下载
2. 运行安装程序，设置密码（记住这个密码！）
3. 安装完成后，PostgreSQL 服务会自动启动

### 创建数据库
```bash
# 创建数据库
createdb heyaihub

# 或使用 psql 命令行
psql -U postgres
CREATE DATABASE heyaihub;
\q
```

### 更新 .env.local
```
DATABASE_URL=postgresql://postgres:你的密码@localhost:5432/heyaihub
```

### 初始化数据库
```bash
npx prisma db push
```

---

## 方案 3：使用 SQLite 临时开发（快速测试）

如果暂时不想配置 PostgreSQL，可以临时使用 SQLite：

### 更新 .env.local
```
DATABASE_URL="file:./dev.db"
```

### 修改 schema.prisma
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 重新生成 Prisma Client
```bash
npx prisma generate
npx prisma db push
```

---

## 验证数据库连接

配置完成后，运行以下命令验证：
```bash
# 测试连接
npx prisma db execute --schema ./prisma/schema.prisma -- --version

# 查看表结构
npx prisma db push --preview-feature
```

---

## 部署到生产环境

对于 Netlify 或其他云平台：
1. 在平台设置中添加 DATABASE_URL 环境变量
2. 确保使用生产环境的连接字符串（包含 sslmode=require）
3. 运行 `npx prisma db push` 或 `npx prisma migrate deploy`

---

## 常见问题

### Q: 连接被拒绝
A: 检查防火墙设置，确保 5432 端口允许访问

### Q: SSL 证书错误
A: 确保连接字符串中包含 `?sslmode=require`

### Q: 数据库不存在
A: 先创建数据库：`CREATE DATABASE heyaihub;`