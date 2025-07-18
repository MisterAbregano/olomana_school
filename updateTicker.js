// updateTicker.js
const fs      = require('fs');
const cheerio = require('cheerio');

const URL = 'https://www.hhsaa.org/about/news';
// …rest of your code…
async function fetchEvents() {
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $    = cheerio.load(html);

    const events = [];
    $('a[href*="/about/news/"]').slice(0, 5).each((i, el) => {
      const raw = $(el).text().trim().replace(/\s+/g, ' ');
      if (raw) events.push(raw);
    });

    if (!events.length) {
      console.warn('⚠️ No news items found on HHSAA News page');
      events.push('No upcoming HHSAA news found');
    }

    fs.writeFileSync('hhsaa_ticker.json', JSON.stringify(events, null, 2), 'utf-8');
    console.log('✅ hhsaa_ticker.json updated:', events);
  } catch (err) {
    console.error('❌ Error updating ticker:', err);
    process.exit(1);
  }
}

fetchEvents();
