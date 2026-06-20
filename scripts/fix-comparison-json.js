/**
 * Fix comparison_pages_data.json - converts backtick template literals to proper JSON
 * Run: node scripts/fix-comparison-json.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'comparison_pages_data.json');
let raw = fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');

function fixBackticks(text) {
  const result = [];
  let i = 0;
  let inBT = false;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '`') {
      if (!inBT) {
        // Check if preceded by ': '
        if (i >= 2 && text[i - 2] === ':') {
          inBT = true;
          result.push('"');
          i++;
          continue;
        }
      } else {
        inBT = false;
        result.push('"');
        i++;
        continue;
      }
    } else if (inBT) {
      if (ch === '"') {
        result.push('\\"');
        i++;
        continue;
      } else if (ch === '\\' && i + 1 < text.length && text[i + 1] === 'n') {
        result.push('\\n');
        i += 2;
        continue;
      } else if (ch === '\\' && i + 1 < text.length && text[i + 1] === '\\') {
        result.push('\\\\');
        i += 2;
        continue;
      }
    }

    result.push(ch);
    i++;
  }

  return result.join('');
}

console.log('Fixing comparison_pages_data.json...');
const fixed = fixBackticks(raw);

// Write back
fs.writeFileSync(filePath, fixed, 'utf-8');

// Verify
try {
  const data = JSON.parse(fixed);
  const pages = data.comparison_pages;
  console.log(`SUCCESS! Fixed file has ${pages.length} comparison pages.`);
  for (const p of pages) {
    console.log(`  - ${p.slug}: ${p.title.substring(0, 60)}...`);
  }
} catch (e) {
  console.error('FAILED to parse:', e.message);
  const pos = e.pos;
  const ctx = fixed.substring(Math.max(0, pos - 50), pos + 50);
  console.log('Context:', JSON.stringify(ctx));
}
