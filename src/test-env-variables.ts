import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 手动加载 .env 文件
const envPath = path.join(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  console.log('\\n=== .env File Content ===');
  console.log(envContent);
  console.log('=========================\\n');
  
  // 手动解析环境变量
  const envVars = envContent.split('\\n').reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      acc[key.trim()] = valueParts.join('=').trim();
    }
    return acc;
  }, {} as Record<string, string>);
  
  console.log('=== Parsed Environment Variables ===');
  console.log('ADMIN_USERNAME:', envVars['ADMIN_USERNAME']);
  console.log('ADMIN_PASSWORD length:', envVars['ADMIN_PASSWORD']?.length);
  console.log('ADMIN_PASSWORD first 20 chars:', envVars['ADMIN_PASSWORD']?.substring(0, 20));
  console.log('ADMIN_SALT length:', envVars['ADMIN_SALT']?.length);
  console.log('NODE_ENV:', envVars['NODE_ENV']);
  console.log('====================================');
} else {
  console.log('ERROR: .env file not found!');
}

