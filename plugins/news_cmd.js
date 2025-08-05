// ============================= REQUEST =============================
const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require("../command");
const config = require('../config');
const DYXT_NEWS = require('@dark-yasiya/news-scrap');
const news = new DYXT_NEWS();

// ============================= L A N G U A G E =============================
var errorMg;

if (config.LANG === 'SI') {
    errorMg = '*දෝශයක් ඇති විය, කරුණාකර පසුව උත්සාහ කරන්න ❌*';

} else if (config.LANG === 'TA') {
    errorMg = '*ஒரு பிழை ஏற்பட்டது, பின்னர் முயற்சிக்கவும் ❌*';

} else if (config.LANG === 'HI') {
    errorMg = '*एक त्रुटि उत्पन्न हुई, कृपया बाद में पुनः प्रयास करें ❌*';

} else {
    errorMg = '*An error occurred, please try again later ❌*';

}        

// ============================= F U N C T I O N S =============================
const backupFacts = [
    "🏝️ ශ්‍රී ලංකාව ලෝකයේ පැරණිතම වැස්ස වනයන් සිටින රටවල් 6 න් එකකි.",
];

async function scrapeFactCrescendo() {
    try {
        const response = await axios.get('https://srilanka.factcrescendo.com/', {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'si-LK,si;q=0.9,en;q=0.8'
            }
        });

        const $ = cheerio.load(response.data);
        const articles = [];

        $('h2 a, h3 a, .entry-title a').each((i, element) => {
            const title = $(element).text().trim();
            const link = $(element).attr('href');
            
            if (title && link && title.length > 10 && title.length < 200) {
                articles.push({
                    title: title,
                    link: link,
                    summary: extractSummaryFromTitle(title)
                });
            }
        });

        if (articles.length > 0) {
            const randomArticle = articles[Math.floor(Math.random() * articles.length)];
            return `📰 *FactCrescendo ශ්‍රී ලංකා:*\n\n` +
                   `${randomArticle.title}\n\n` +
                   `${randomArticle.summary}\n\n` +
                   `🔗 විස්තර: ${randomArticle.link}`;
        }

    } catch (error) {
        console.log('FactCrescendo scraping failed:', error.message);
    }
    return null;
}

function extractSummaryFromTitle(title) {
    if (title.includes('?')) {
        return `🤔 මෙම ප්‍රශ්නය සම්බන්ධයෙන් සත්‍ය කරුණු සොයා බැලීමක් සිදුකර ඇත.`;
    } else if (title.includes('අසත්ය') || title.includes('false')) {
        return `❌ මෙය අසත්‍ය තොරතුරක් බවට සනාථ කර ඇත.`;
    } else if (title.includes('සත්ය') || title.includes('true')) {
        return `✅ මෙම තොරතුරු සත්‍ය බවට තහවුරු කර ඇත.`;
    } else {
        return `📊 මෙය FactCrescendo විසින් සත්‍යතාව පරීක්ෂා කළ කරුණක්.`;
    }
}

async function getWikipediaFact() {
    try {
        const wikiResponse = await axios.get('https://si.wikipedia.org/api/rest_v1/page/random/summary', {
            timeout: 5000
        });
        
        if (wikiResponse.data && wikiResponse.data.extract) {
            const extract = wikiResponse.data.extract.substring(0, 250);
            return `📖 *විකිපීඩියා:*\n\n${extract}...\n\n🔗 ${wikiResponse.data.content_urls.desktop.page}`;
        }
    } catch (error) {
        console.log('Wikipedia API failed:', error.message);
    }
    return null;
}

async function getSinhalaFact() {
    let fact = await scrapeFactCrescendo();
    if (fact) return fact;

    fact = await getWikipediaFact();
    if (fact) return fact;

    const randomIndex = Math.floor(Math.random() * backupFacts.length);
    return `🇱🇰 *ශ්‍රී ලංකා කරුණක්:*\n\n${backupFacts[randomIndex]}`;
}

//============================ C M D ============================
cmd({
    pattern: "slfact",
    alias: ["factcrescendot"],
    desc: "ශ්‍රී ලංකා සම්බන්ධ සත්‍ය කරුණු ලබා ගන්න",
    category: "news",
    react: "🇱🇰",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

        await conn.sendMessage(from, { react: { text: '🔍', key: mek.key } });
        
        if (q && (q.toLowerCase().includes('help') || q.includes('උදව්'))) {
            const helpText = `🤖 *Sinhala Facts Bot*\n\n` +
                           `📝 *Commands:*\n` +
                           `• .fact - Random Sri Lankan fact\n` +
                           `• .සිංහල - සිංහල කරුණක්\n` +
                           `• .lk - ශ්‍රී ලංකා කරුණක්\n` +
                           `• .කරුණ - රසවත් කරුණක්\n\n` +
                           `🔍 *Sources:*\n` +
                           `• FactCrescendo Sri Lanka\n` +
                           `• Wikipedia Sinhala\n` +
                           `• Curated fact database\n\n` +
                           `_Type any command to get interesting facts!_ 📚`;
            
            return await reply(helpText);
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        
        const fact = await getSinhalaFact();
        
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
        await reply(fact);
        
    } catch (error) {
        console.error('Sinhala Facts Error:', error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply('❌ කරුණාකර නැවත උත්සාහ කරන්න.');
    }
});

cmd({
    pattern: "ada",
    alias: ["adanews"],
    desc: "Get latest Ada News headline",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const result = await news.ada();
        const data = result?.result;

        let newsMsg = `📰 *Ada News* 📰\n\n` +
                      `📌 *Title:* ${data.title || 'N/A'}\n` +
                      `📅 *Date:* ${data.date || 'N/A'}\n` +
                      `⏰ *Time:* ${data.time || 'N/A'}\n\n` +
                      `🗞️ *News:* ${data.desc || 'No description'}\n\n` +
                      `🔗 *URL:* ${data.url || 'N/A'}\n\n` +
                      `${config.FOOTER}`;

        await conn.sendMessage(from, { image: { url: data.image || config.LOGO }, caption: newsMsg }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg);
    }
});

cmd({
    pattern: "gagana",
    alias: ["gagananews"],
    desc: "Get latest Gagana News headline",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const result = await news.gagana();
        const data = result?.result;

        let newsMsg = `📰 *Gagana News* 📰\n\n` +
                      `📌 *Title:* ${data.title || 'N/A'}\n\n` +
                      `🗞️ *News:* ${data.desc || 'No description'}\n\n` +
                      `🔗 *URL:* ${data.url || 'N/A'}\n\n` +
                      `${config.FOOTER}`;

        await conn.sendMessage(from, { image: { url: data.image || config.LOGO }, caption: newsMsg }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg);
    }
});

cmd({
    pattern: "lankadeepa",
    alias: ["lankadeepanews"],
    desc: "Get latest Lankadeepa News headline",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const result = await news.lankadeepa();
        const data = result?.result;

        let newsMsg = `📰 *Lankadeepa News* 📰\n\n` +
                      `📌 *Title:* ${data.title || 'N/A'}\n` +
                      `📅 *Date:* ${data.date || 'N/A'}\n\n` +
                      `🗞️ *News:* ${data.desc || 'No description'}\n\n` +
                      `🔗 *URL:* ${data.url || 'N/A'}\n\n` +
                      `${config.FOOTER}`;

        await conn.sendMessage(from, { image: { url: data.image || config.LOGO }, caption: newsMsg }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg);
    }
});

cmd({
    pattern: "newswire",
    alias: ["newswirenews"],
    desc: "Get latest Newswire News headline",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const result = await news.newswire();
        const data = result?.result;

        let newsMsg = `📰 *Newswire News* 📰\n\n` +
                      `📌 *Title:* ${data.title || 'N/A'}\n\n` +
                      `🗞️ *News:* ${data.desc || 'No description'}\n\n` +
                      `🔗 *URL:* ${data.url || 'N/A'}\n\n` +
                      `${config.FOOTER}`;

        await conn.sendMessage(from, { text: newsMsg }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg);
    }
});

cmd({
    pattern: "sirasa",
    alias: ["sirasanews"],
    desc: "Get latest Sirasa News headline",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const result = await news.sirasa();
        const data = result?.result;

        let newsMsg = `📰 *Sirasa News* 📰\n\n` +
                      `📌 *Title:* ${data.title || 'N/A'}\n` +
                      `📅 *Date:* ${data.date.split('|')[0].trim() || 'N/A'}\n` +
                      `⏰ *Time:* ${data.date.split('|')[1].trim() || 'N/A'}\n\n` +
                      `🗞️ *News:* ${data.desc || 'No description'}\n\n` +
                      `🔗 *URL:* ${data.url || 'N/A'}\n\n` +
                      `${config.FOOTER}`;

        await conn.sendMessage(from, { image: { url: data.image || config.LOGO }, caption: newsMsg }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg);
    }
});

cmd({
    pattern: "derana",
    alias: ["derananews"],
    desc: "Get latest Derana News headline",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const result = await news.derana();
        const data = result?.result;

        let newsMsg = `📰 *Derana News* 📰\n\n` +
                      `📌 *Title:* ${data.title || 'N/A'}\n` +
                      `📅 *Date & Time:* ${data.date || 'N/A'}\n\n` +
                      `🗞️ *News:* ${data.desc || 'No description'}\n\n` +
                      `🔗 *URL:* ${data.url || 'N/A'}\n\n` +
                      `${config.FOOTER}`;

        await conn.sendMessage(from, { image: { url: data.image || config.LOGO }, caption: newsMsg }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg);
    }
});
