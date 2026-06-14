# 🔧 Neon PostgreSQL 数据库配置 - 详细步骤

## 📱 第一步：从 Neon 获取连接字符串

### 1. 打开 Neon 控制台
访问：https://console.neon.tech

### 2. 找到你的项目
- 你应该看到 "Heyaihuh" 项目
- 点击项目名称进入详情

### 3. 获取连接字符串
- 找到 **"Connect"** 按钮
- 点击后显示类似这样的内容：

`
postgresql://tttvvvwww:password123@ep-cool-darkness-123456.us-east-1.aws.neon.tech/heyaihub?sslmode=require
`

### 4. 复制完整字符串
- 选中整个连接字符串
- 按 Ctrl+C 复制

## 💻 第二步：配置项目

### 1. 打开项目文件夹
- 打开 C:\Users\wangxiaoping\Documents\New project\ai-tool-navigator
- 找到 .env.local 文件

### 2. 编辑 .env.local
- 用记事本打开 .env.local
- 找到 DATABASE_URL= 这一行
- 粘贴你的连接字符串

## 🚀 第三步：初始化数据库

### 1. 打开 PowerShell
- 在 i-tool-navigator 文件夹中
- 右键 -> 在终端中打开

### 2. 运行数据库初始化
`ash
npx prisma db push
`

## ✅ 完成检查

### 1. 启动开发服务器
`ash
npm run dev
`

### 2. 访问应用
- 打开浏览器访问：http://localhost:3000
- 应该能看到你的 AI 工具导航站了！

## 🆘 常见问题

### Q: 找不到连接字符串？
A: 点击项目旁边的 **"..."** 菜单，选择 **"Connection string"**

### Q: 连接失败？
A: 检查连接字符串是否完整，包含完整的 URL

### Q: 数据库初始化失败？
A: 确保网络连接正常，Neon 服务可用

## 🎯 下一步
配置完成后，你就可以：
- 添加 AI 工具到数据库
- 管理工具内容
- 查看后台管理界面
- 开始使用你的 AI 工具导航站！