const fs = require('fs');
const path = require('path');

// 手动加载 .env 文件
const envPath = path.join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // 手动解析环境变量
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const eqIndex = line.indexOf('=');
    if (eqIndex > 0) {
      const key = line.substring(0, eqIndex).trim();
      const value = line.substring(eqIndex + 1).trim();
      envVars[key] = value;
    }
  });
  
  console.log('\n=== Parsed Environment Variables ===');
  console.log(JSON.stringify(envVars, null, 2));
  console.log('====================================');
  
  // 验证密码哈希
  const password = envVars['ADMIN_PASSWORD'];
  if (password) {
    console.log('\n=== Password Verification ===');
    console.log('Type:', typeof password);
    console.log('Value:', password);
    console.log('Length:', password.length);
    console.log('Starts with $2b$12$:', password.startsWith('$2b$12$'));
    console.log('=================================');
  }
} else {
  console.log('ERROR: .env file not found!');
}


