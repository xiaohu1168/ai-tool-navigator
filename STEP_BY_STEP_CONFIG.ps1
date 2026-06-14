Write-Host "=== Neon PostgreSQL 简单配置指南 ===" -ForegroundColor Green
Write-Host ""
Write-Host "请按以下步骤操作：" -ForegroundColor Yellow
Write-Host ""
Write-Host "步骤 1: 获取连接字符串" -ForegroundColor Cyan
Write-Host "1. 访问 https://console.neon.tech" -ForegroundColor White
Write-Host "2. 点击你的项目 'Heyaihuh'" -ForegroundColor White  
Write-Host "3. 点击 'Connect' 或 'Connection string'" -ForegroundColor White
Write-Host "4. 复制显示的完整连接字符串" -ForegroundColor White
Write-Host ""
Write-Host "步骤 2: 粘贴连接字符串" -ForegroundColor Cyan
Write-Host "下面会提示你粘贴连接字符串" -ForegroundColor White
Write-Host ""
Write-Host "准备就绪？按任意键继续..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")