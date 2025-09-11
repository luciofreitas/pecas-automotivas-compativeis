const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.resolve(__dirname, '..', 'tmp_screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const base = 'http://localhost:5174';
  // full list of routes from src/App.jsx
  const routes = [
    '/', '/inicio', '/quem-somos', '/seja-pro', '/versao-pro', '/checkin',
    '/versao-pro-assinado', '/contato', '/contato-logado', '/parceiros',
    '/nosso-projeto', '/perfil', '/login'
  ];

  for (const r of routes) {
    const url = base + r;
    console.log('Opening', url);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
  // wait for body and a small fixed delay to allow animations and fonts
  await page.waitForSelector('body', { timeout: 10000 });
  await new Promise(resolve => setTimeout(resolve, 700));
      const name = (r === '/' ? 'buscarpeca' : r.replace(/\W+/g, '_'));
      const file = path.join(outDir, name + '.png');
      await page.screenshot({ path: file, fullPage: true });
      console.log('Saved', file);

      // try to capture header/menu area for visual comparison
      try {
        const headerRect = await page.evaluate(() => {
          const sel = document.querySelector('header, .menu-page, .Menu, .menu, .menu-login, .MenuLogin');
          if (!sel) return null;
          const r = sel.getBoundingClientRect();
          return { x: Math.max(0, Math.floor(r.x)), y: Math.max(0, Math.floor(r.y)), width: Math.floor(Math.min(r.width, document.documentElement.clientWidth)), height: Math.floor(r.height) };
        });

        const headerFile = path.join(outDir, name + '.header.png');
        if (headerRect && headerRect.width > 0 && headerRect.height > 0) {
          // ensure clip fits inside the viewport
          const clip = { x: headerRect.x, y: headerRect.y, width: headerRect.width, height: headerRect.height };
          await page.screenshot({ path: headerFile, clip });
          console.log('Saved header crop', headerFile);
        } else {
          // fallback: take top 140px area
          await page.screenshot({ path: headerFile, clip: { x: 0, y: 0, width: 1280, height: 140 } });
          console.log('Saved header fallback', headerFile);
        }
      } catch (e) {
        console.warn('Header capture failed for', r, e.message);
      }
    } catch (e) {
      console.error('Failed', url, e.message);
    }
  }

  await browser.close();
  console.log('Done');
})();
