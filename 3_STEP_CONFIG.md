# 🎯 简单三步配置 Neon 数据库

## 第一步：获取连接字符串

1. 访问 https://console.neon.tech
2. 点击你的项目 "Heyaihuh"
3. 找到 "Connect" 按钮
4. 复制显示的完整连接字符串

## 第二步：更新 .env.local 文件

1. 打开文件：
   C:\Users\wangxiaoping\Documents\New project\ai-tool-navigator\.env.local

2. 找到这一行：
   DATABASE_URL=postgresql://USER:PASSWORD@ep-xxxxx.region-1.aws.neon.tech/heyaihub?sslmode=require

3. 将 USER:PASSWORD 部分替换为你从 Neon 复制的实际信息

## 第三步：初始化数据库

在 PowerShell 中运行：
cd "C:\Users\wangxiaoping\Documents\New project\ai-tool-navigator"
npx prisma db push

## 完成！

运行以下命令启动应用：
npm run dev

然后访问 http://localhost:3000