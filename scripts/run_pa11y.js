const { exec } = require('child_process');
const fs = require('fs');

const env = Object.assign({}, process.env, {
  PUPPETEER_SKIP_DOWNLOAD: '1',
  PUPPETEER_EXECUTABLE_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
});

exec('npx pa11y http://localhost:3000 --reporter json', { env }, (err, stdout, stderr) => {
  const outPath = `reports/pa11y_report_${Date.now()}.json`;
  try {
    fs.writeFileSync(outPath, stdout || stderr, { encoding: 'utf8' });
  } catch (e) {
    console.error('write error', e);
    process.exit(1);
  }
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('wrote', outPath);
  }
});
