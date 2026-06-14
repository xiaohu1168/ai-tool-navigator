const fs = require('fs');
const filePath = 'C:/Users/wangxiaoping/Documents/New project/ai-tool-navigator/src/app/tools/[slug]/page.tsx';
let text = fs.readFileSync(filePath, 'utf-8');
const marker = 'use client';
if (text.indexOf(marker) === -1) {
  const idx = text.indexOf('import');
  const prefix = text.substring(0, idx);
  const directive = "' + marker + '";
  text = prefix + directive + ';\n' + text.substring(idx);
  const buf = Buffer.from(text, 'utf-8');
  fs.writeFileSync(filePath, buf);
  console.log('Done - added use client directive');
} else {
  console.log('Already has directive');
}
