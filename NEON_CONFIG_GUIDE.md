# Neon PostgreSQL 配置步骤

1. 登录 Neon 控制台: https://console.neon.tech
2. 点击你的项目 "Heyaihuh"
3. 点击 "Connect" 或 "Connection string"
4. 复制完整的连接字符串
5. 替换 .env.local 中的 DATABASE_URL
6. 运行: npx prisma db push

示例连接字符串格式:
postgresql://username:password@ep-xxx.region-1.aws.neon.tech/database?sslmode=require