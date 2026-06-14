# PostgreSQL 数据库配置脚本
# 使用方法: 在 PowerShell 中运行 "config-postgres.ps1"

Write-Host "=== PostgreSQL 数据库配置 ===" -ForegroundColor Green
Write-Host ""

# 检查是否安装了 PostgreSQL
Write-Host "检查 PostgreSQL 安装..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlPath) {
    Write-Host "PostgreSQL 已安装!" -ForegroundColor Green
    $psqlPath.Source
} else {
    Write-Host "PostgreSQL 未安装" -ForegroundColor Red
    Write-Host "建议方案:" -ForegroundColor Yellow
    Write-Host "1. 使用 Neon 免费 PostgreSQL (推荐): https://neon.tech"
    Write-Host "2. 本地安装 PostgreSQL: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads"
    Write-Host "3. 使用 SQLite 临时开发 (快速测试)"
    exit 0
}

Write-Host ""
Write-Host "1. 创建数据库..." -ForegroundColor Yellow
try {
    & psql -U postgres -c "CREATE DATABASE heyaihub;" 2>$null
    Write-Host "数据库创建成功!" -ForegroundColor Green
} catch {
    Write-Host "数据库可能已存在或创建失败" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. 获取本地 PostgreSQL 连接信息..." -ForegroundColor Yellow
$host = "localhost"
$port = "5432"
$user = "postgres"
$db = "heyaihub"
Write-Host "连接字符串格式: postgresql://${user}:密码@${host}:${port}/${db}"

Write-Host ""
Write-Host "3. 更新 .env.local 文件..." -ForegroundColor Yellow
$envContent = @"
# Hey AI Hub - PostgreSQL 配置

# 数据库连接
DATABASE_URL=postgresql://${user}:@${host}:${port}/${db}

# Google AdSense
NEXT_PUBLIC_ADSENSE_PUB_ID=pub-placeholder

# 管理员认证
ADMIN_USERNAME=admin
ADMIN_PASSWORD=heyaihub2026

# 管理员盐值
ADMIN_SALT=your-super-secret-salt-change-this-in-production
"@

# 询问是否自动更新 .env.local
$response = Read-Host "是否自动更新 .env.local 文件? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    $envContent | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host ".env.local 文件已更新!" -ForegroundColor Green
} else {
    Write-Host "请手动更新 .env.local 文件" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4. 初始化数据库表结构..." -ForegroundColor Yellow
npx prisma db push

Write-Host ""
Write-Host "=== 配置完成! ===" -ForegroundColor Green
Write-Host "接下来可以运行 'npm run dev' 启动开发服务器" -ForegroundColor Cyan