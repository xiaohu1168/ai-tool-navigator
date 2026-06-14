(async () => {
  try {
    const pa11y = require('pa11y');
    const puppeteer = require('puppeteer-core');
    const fs = require('fs');
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const browser = await puppeteer.launch({ executablePath: chromePath, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const results = await pa11y('http://localhost:3000', { browser });
    await browser.close();
    const outPath = `reports/pa11y_programmatic_${Date.now()}.json`;
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('wrote', outPath);
  } catch (err) {
    console.error('error', err);
    process.exit(1);
  }
})();
