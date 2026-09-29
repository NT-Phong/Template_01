import fs from 'fs';

async function run() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await listRes.json();
  const pageTab = tabs.find(t => t.url.includes('5173') && t.type === 'page') || tabs.find(t => t.type === 'page');

  if (!pageTab) {
    console.error('No page tab found');
    return;
  }

  console.log('Connecting to:', pageTab.title, pageTab.webSocketDebuggerUrl);
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const resolve = callbacks.get(data.id);
      callbacks.delete(data.id);
      resolve(data.result);
    }
  };

  await new Promise((resolve) => (ws.onopen = resolve));

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Reload page to observe full flow
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  console.log('Navigated, waiting 6.0s for entrance...');
  await new Promise((r) => setTimeout(r, 6000));

  // 1. Capture Hero
  const heroSnap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:/motionsites/Luxury-Real-Estate/captured_hero.png', Buffer.from(heroSnap.data, 'base64'));
  console.log('Saved captured_hero.png');

  // 2. Scroll to Section 5
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 750, behavior: "instant" })' });
  await new Promise((r) => setTimeout(r, 1200));
  const s5Snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:/motionsites/Luxury-Real-Estate/captured_s5.png', Buffer.from(s5Snap.data, 'base64'));
  console.log('Saved captured_s5.png');

  // 3. Scroll to Section 6 Gallery
  await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1600, behavior: "instant" })' });
  await new Promise((r) => setTimeout(r, 1200));
  const s6Snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('d:/motionsites/Luxury-Real-Estate/captured_s6.png', Buffer.from(s6Snap.data, 'base64'));
  console.log('Saved captured_s6.png');

  ws.close();
  console.log('Done capturing!');
}

run().catch(console.error);
