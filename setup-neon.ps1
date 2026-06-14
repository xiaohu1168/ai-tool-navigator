# Neon PostgreSQL 配置助手
# 请按照以下步骤操作:

Write-Host "=== Neon PostgreSQL 配置指南 ===" -ForegroundColor Green
Write-Host ""
Write-Host "根据你的 Neon 控制台截图，你需要:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 获取连接字符串:" -ForegroundColor Cyan
Write-Host "   - 在 Neon 控制台中点击 'Heyaihuh' 项目" -ForegroundColor White
Write-Host "   - 点击 'Connection string' 或 'Connect'" -ForegroundColor White
Write-Host "   - 复制完整的连接字符串" -ForegroundColor White
Write-Host ""
Write-Host "2. 连接字符串格式示例:" -ForegroundColor Cyan
Write-Host "   postgresql://username:password@ep-xxx.region-1.aws.neon.tech/database?sslmode=require" -ForegroundColor White
Write-Host ""
Write-Host "3. 配置项目:" -ForegroundColor Cyan
Write-Host "   a. 更新 .env.local 文件中的 DATABASE_URL" -ForegroundColor White
Write-Host "   b. 运行数据库初始化命令" -ForegroundColor White
Write-Host ""
Write-Host "4. 数据库初始化:" -ForegroundColor Cyan
Write-Host "   npx prisma db push" -ForegroundColor White
Write-Host ""
Write-Host "=== 开始配置 ===" -ForegroundColor Green

# 提示用户输入
$connectionString = Read-Host "请粘贴你的 Neon 连接字符串"

if ($connectionString -match "postgresql://") {
    Write-Host "`n更新 .env.local 文件..." -ForegroundColor Yellow
    
    $envContent = @"
# Hey AI Hub - Neon PostgreSQL 配置

# 数据库连接 (Neon)
DATABASE_URL=${connectionString}

# Google AdSense
NEXT_PUBLIC_ADSENSE_PUB_ID=pub-placeholder

# 管理员认证
ADMIN_USERNAME=admin
ADMIN_PASSWORD=heyaihub2026

# 管理员盐值
ADMIN_SALT=your-super-secret-salt-change-this-in-production
"@

    $envContent | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host ".env.local 文件已更新!" -ForegroundColor Green
    
    Write-Host "`n初始化数据库表结构..." -ForegroundColor Yellow
    npx prisma db push
    
    Write-Host "`n=== Neon PostgreSQL 配置完成! ===" -ForegroundColor Green
    Write-Host "你可以现在运行 'npm run dev' 启动开发服务器" -ForegroundColor Cyan
} else {
    Write-Host "无效的连接字符串格式" -ForegroundColor Red
    Write-Host "应该以 'postgresql://' 开头" -ForegroundColor Yellow
}