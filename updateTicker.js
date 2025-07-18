// updateTicker.js
// 🏀 Scrapes the HHSAA website for sports headlines and updates the ticker feed

const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// HHSAA sports section — change this to a specific sport if needed
const URL = 'https://www.hhsaa.org/sports/football';

async function fetchEvents() {
  try {
    const res = await fetch(URL);
    const html = await res.text();
    const $ = cheerio.load(html);

    const events = [];

    // Looks for article items on the page (adjust if HHSAA changes layout)
    $('.news-item').slice(0, 5).each((i, el) => {
      const title = $(el).find('h3').text().trim();
      const date = $(el).find('.date').text().trim();
      if (title && date) {
        events.push(`${date}: ${title}`);
      }
    });

    // Save to a file your website can read
    fs.writeFileSync('hhsaa_ticker.json', JSON.stringify(events, null, 2));
    console.log('✅ Ticker updated successfully!');
  } catch (err) {
    console.error('❌ Error updating ticker:', err);
  }
}

fetchEvents();
