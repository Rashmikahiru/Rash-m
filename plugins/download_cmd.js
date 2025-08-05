// ============================= REQUEST =============================
const config = require('../config');
const { cmd } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, checkDailymotionLink, checkGDriveLink, getThumbnailFromUrl, resizeThumbnail } = require('../lib/functions')
const fg = require('api-dylux');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();
const { tiktok, ytmp3_v2, fbdownload, ytmp4_v2, mediaFire, apkSearch, apkDownload, twitter, xvideosSearch, xvideosdl } = require("../lib/scraper");
const { storenumrepdata } = require('../lib/numreply-db')
const deneth = require('denethdev-ytmp3');
const { igdl } = require('ruhend-scraper')
const { File } = require('megajs');
const axios = require('axios'); 
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const gis = require('async-g-i-s');
const mime = require('mime-types');


const PIXABAY_API_KEY = '41400543-cbba021cd3b6a727f4d9f07ea';
const PIXABAY_API_URL = 'https://pixabay.com/api/';
const UNSPLASH_ACCESS_KEY = "BYgvJYrD82nWIhbsB_VnhbxDydTuZRG3fiNYdkzq6oU";
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const genuxApikey = "GENUX-CWWT9CW";
const fgapikey = "fg_O92PDkFv";
const PEXELS_KEYS = [
    "FvX2AuANrkfYcN45n0FOChXVyuK3zRL51gM5SZuAERoRxB1CDLCJLy4l",
    "62IJ8dWHipKEAg8Zs5CjACVYiyrJdGL2wQl88UV4uQPn3bYE6ySG4jcU",
    "jIHcJCGoMjXSrGNO3RJz3aLWBGClmLzZEbtawDe6XO8rfCshsG8LTSKl"
  ];

const folderMap = {
  boot: "17Qe6Hf0SkE1MwpereiineV52rl1c20XF",
  love: "1LW0vT9DQBlpFHxrIbjeK1p3mDcUqtKu4",
  sigma: "1xne5ulmAEYWS1G36yujaFXpCsINLI0AT",
  joke: "1otowJR67KFK7ljmK2UO99syoKAIRnlba"
};

const apilink = "https://darkyasiya-new-movie-api.vercel.app/";
const apikey = '';
const botName = '𝚁𝙰𝚂𝙷-𝙼𝙳';
const { buttonDesc } = require('../lib/config');
// ======================================================
const PEXELS_API_KEY = PEXELS_KEYS[Math.floor(Math.random() * PEXELS_KEYS.length)];
// ============================= F U N C T I O N S =============================
function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function formatNumber(num) {
    return String(num).padStart(2, '0');
} 

function capitalizeFirst(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ============================= L A N G U A G E =============================
var errorMg, numreplyMg, tiktokMg, tiktokFailMg, ytMg, fbMg, fbFailMg, twMg, twFailMg, mfireMg, igMg, githubMg, gdMg, apkMg, megaMg, mediaMg, notFoundMg, invalidReply, imgUsage, imgNotFound, imgFetchError, wallUsage, wallNotFound, wallFetchError, wallInvalidType, validUrlMg, downMg, downUrlNotfound, buttonTitle, pageUrlError, fetchPageError, fetchPageSourceError, fetchRomanticVideoError, fetchRomanticImagesError, fetchMediaError, fetchMediaApiError, noMediaFoundError, needText, disXvdl;


    errorMg = '*An error occurred, please try again later ❌*';
    numreplyMg = '*🔢 Please reply with the number you want to select:*';
    tiktokMg = '*❌ Please provide a valid TikTok URL!*';
    tiktokFailMg = '*❌ Failed to download TikTok video.*';
    ytMg = '*❌ Please provide a valid YouTube URL!*';
    fbMg = '*❌ Please provide a valid Facebook URL!*';
    fbFailMg = '*❌ Failed to download Facebook video.*';
    twMg = '*❌ Please provide a valid Twitter URL!*';
    twFailMg = '*❌ Failed to download Twitter video.*';
    mfireMg = '*❌ Please provide a valid MediaFire URL!*';
    igMg = '*❌ Please provide a valid Instagram URL!*';
    githubMg = '*❌ Please provide a valid Github URL!*';
    gdMg = '*❌ Please provide a valid Google Drive URL!*';
    apkMg = '*❌ Please provide an APK name!*';
    megaMg = '*❌ Please provide a valid Mega.nz URL!*';
    mediaMg = '*✅ Media uploaded successfully ✅*';
    notFoundMg = '*I couldn’t find anything 📛*';
    invalidReply = '❌ Invalid choice! Reply with ';
    imgUsage = '❌ Enter a word to search for an image!' + `\nUsage : ${config.PREFIX}img <Name> `;
    imgNotFound = '*❌ No image found for the word you entered!*';
    imgFetchError = '*❌ An error occurred while searching for images.*';
    wallUsage = "❌ *Please enter wallpaper type & search term!*\nExample: `.wallpaper mobile nature`\n`.wallpaper desktop cars`";
    wallNotFound = "🚫 *No wallpapers found!* Try another search.";
    wallFetchError = "⚠️ *Failed to download wallpapers! Try again later.*";
    wallInvalidType = "❌ *Invalid type! Use 'mobile' or 'desktop'.*\nExample: `.wallpaper mobile city`";  
    validUrlMg = "*Please provide a valid link ❌*";
    downMg = "*Starting to download...⬇*";
    downUrlNotfound = "*Download link not found ❌*";
    neddDirectUrl = "*📎 Please provide a valid direct file URL.*\n\n_Example";
    errorMgMega = "❌ *Failed to download the MEGA file.* Please check the link or try again later.";
    buttonTitle = "Click Here 📲";
    needText = "*❓ Please provide a word to search.*";
    disXvdl = "*This command has been disabled. ⛔️*";
    pageUrlError = '🌐 *Provide a website URL!* \nExample:\n.pagesource https://example.com\n.pagesource https://example.com --json\n.pagesource https://example.com --json --tmsg';
    fetchPageError = '❌ *Error fetching page:*';
    fetchPageSourceError = '⚠️ *Failed to fetch the page source. Check the URL and try again.*';
    fetchRomanticVideoError = '❌ *Failed to fetch romantic video.*';
    fetchRomanticImagesError = '😢 *No romantic images found.*';
    fetchMediaError = '❌ *Failed to fetch media.*';
    fetchMediaApiError = '❌ *Check API key or folder access.*';
    noMediaFoundError = '😢 *No media found in that category.*';




//============================ TIK TOK ============================
cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    react: "📹",
    desc: "Download TikTok videos",
    category: "download",
    use: "tiktok < TikTok URL >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, prefix }) => {
    try {

        const url = q.split(" ")[0];
        const cmdRun = q.split(" ")[1] || "false";

        if ((!q || !isUrl(url)) && cmdRun !== "true") {
            return await reply(tiktokMg, "❓");
        }


        const response = await tiktok(q);
        if(!response?.status) return await reply(tiktokFailMg, "❌");
        const { id, region, title, cover, duration, play, sd, hd, music, play_count, digg_count, comment_count, share_count, download_count, collect_count } = response?.result;
	var type = isUrl(url) ? "URL" : "ID";
        
       let info = `\`🏮 ${botName} 𝖳𝖨𝖪𝖳𝖮𝖪 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🏮\`\n\n` +
           `┏━━━━━━━━━━━━━━━━━┓\n` +
           `┣ 🎵 *Title:* ${title}\n\n` +
           `┣ ⏳ *Duration:* ${duration}\n` +
           `┣ 👀 *Views:* ${play_count}\n` +
           `┣ ❤️ *Likes:* ${digg_count}\n` +
           `┗━━━━━━━━━━━━━━━━━┛\n`
           
           
           if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
        const listData = {
          title: "Download Video 🎬",
          sections: [
            {
              title: "📂 Video Type",
              rows: [
                { title: "Watermark Video 📹", description: buttonDesc, id: `${prefix}tt_dl ${sd} SD VIDEO=${title}` },
                { title: "Without Watermark Video 🎥", description: buttonDesc, id: `${prefix}tt_dl ${sd} HD VIDEO=${title}` }
              ]
            },{
              title: "🎥 Document Type",
              rows: [
                { title: "Watermark Video 📹", description: buttonDesc, id: `${prefix}tt_dl ${sd} SD DOC=${title}` },
                { title: "Without Watermark Video 🎥", description: buttonDesc, id: `${prefix}tt_dl ${sd} HD DOC=${title}` }
              ]
            }
          ]
        };
        
        
        const listData2 = {
          title: "Download Audio 🎶",
          sections: [
            {
              title: "🎧 Music",
              rows: [
                { title: "Audio 🎼", description: buttonDesc, id: `${prefix}tt_dl ${music} MUSIC AUDIO=${title}` },
                { title: "Document 📁", description: buttonDesc, id: `${prefix}tt_dl ${music} MUSIC DOC=${title}` },
                { title: "Voice 🎤", description: buttonDesc, id: `${prefix}tt_dl ${music} MUSIC VOICE=${title}` }
              ]
            }
          ]
        };

         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: `${type}: ${url}`,
          contextInfo: {
                externalAdReply: {
                     title: `🏮 ${botName} 𝖳𝖨𝖪𝖳𝖮𝖪 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🏮`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: q
          }},
          buttons: [
            {
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData)
              }
            },{
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData2)
              }
            }
          ],
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
        info += `\n${numreplyMg}\n\n` +
           `_[1] 📂 Video Type_\n` +
           `1.1  *Watermark Video* 📹\n` +
           `1.2  *Without Watermark Video* 🎥\n\n` +
           `_[2] 🎥 Document Type_\n` +
           `2.1  *Watermark Video* 📹\n` +
           `2.2  *Without Watermark Video* 🎥\n\n` +
	   `_[3] 🎧 Music_\n` +
           `3.1  *Audio* 🎼\n` +
           `3.2  *Document* 📁\n` +
	   `3.3  *Voice* 🎤\n\n` +
           `> ${type}: ${url}`;
           
        const numrep = [];
        numrep.push(`1.1 ${prefix}tt_dl ${sd} SD VIDEO=${title}`);
        numrep.push(`1.2 ${prefix}tt_dl ${hd} HD VIDEO=${title}`);
        numrep.push(`2.1 ${prefix}tt_dl ${sd} SD DOC=${title}`);
        numrep.push(`2.2 ${prefix}tt_dl ${hd} HD DOC=${title}`);
        numrep.push(`3.1 ${prefix}tt_dl ${music} MUSIC AUDIO=${title}`);
        numrep.push(`3.2 ${prefix}tt_dl ${music} MUSIC DOC=${title}`);
        numrep.push(`3.3 ${prefix}tt_dl ${music} MUSIC VOICE=${title}`);

        
        const sentMsg = await conn.sendMessage(from, { image: { url: cover }, caption: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: `🏮 ${botName} 𝖳𝖨𝖪𝖳𝖮𝖪 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🏮`,
                                          body: config.BODY || "",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: q
                                      }}}, { quoted: mek });
        
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🎥', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'decimal'
                          }
                        await storenumrepdata(jsonmsg);
                  }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "tt_dl",    
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        
        if (!q || !q.includes("https")) {
            return await reply(notFoundMg, "📛");
        }

        const url = q.split(" ")[0];
        const quality = q.split(" ")[1];
        const type = q.split(" ")[2].split("=")[0].toLowerCase() || 'video';
        const title = q.split("=")[1] || '';

        if(quality === "MUSIC"){
		
		if(type === "audio"){
        await conn.sendMessage(from, { audio: { url }, mimetype: "audio/mpeg" }, { quoted: mek });
        await m.react("✅");
			
		} else if(type === "doc"){
        await conn.sendMessage(from, { document: { url }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: `${title}\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
			
		} else if(type === "voice"){
        await conn.sendMessage(from, { audio: { url }, mimetype: "audio/mpeg", ptt: true }, { quoted: mek });
        await m.react("✅");
			
	    }  
		
        } else if(type === "video"){
        const msg = await conn.sendMessage(from, { text: `📥 Downloading ${quality} Video...` }, { quoted: mek });
        await conn.sendMessage(from, { video: { url }, fileName: `${title}.mp4`, caption: `🎥 *Here is your TikTok Video!*\n\n_${title}_\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
        await conn.sendMessage(from, { text : mediaMg , edit : msg.key })
            
        } else if(type === "doc"){
        const msg = await conn.sendMessage(from, { text: `📥 Downloading ${quality} Video...` }, { quoted: mek });
        await conn.sendMessage(from, { document: { url }, fileName: `${title}.mp4`, mimetype: "video/mp4", caption: `🎥 *Here is your TikTok Video!*\n\n_${title}_\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
        await conn.sendMessage(from, { text : mediaMg , edit : msg.key })
            
        }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

//============================ SONG & VIDEO ============================
cmd({
    pattern: "song",
    alias: ["ytmp3", "ytmp3dl", "mp3"],
    react: "🎵",
    desc: "Download Ytmp3",
    category: "download",
    use: "song < Text or YT URL >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, prefix }) => {
    try {
        
        if (!q) return await reply(ytMg, "❓");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply(notFoundMg, "📛");
            id = searchResults.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply(notFoundMg, "📛");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        let info = `\`🎶 ${botName} 𝖲𝖮𝖭𝖦 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🎶\`\n\n` +
            `┏━━━━━━━━━━━━━━━━━┓\n` +
            `┣ 🎵 *Title:* ${title || "Unknown"}\n` +
            `┣ ⏳ *Duration:* ${timestamp || "Unknown"}\n` +
            `┣ 👀 *Views:* ${views || "Unknown"}\n` +
            `┣ 🌏 *Release Ago:* ${ago || "Unknown"}\n` +
            `┣ 👤 *Author:* ${author?.name || "Unknown"}\n` +
            `┣ 🖇 *Url:* ${url || "Unknown"}\n` +
            `┗━━━━━━━━━━━━━━━━━┛\n` 
            
                       if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
 
         const buttons = [
             { buttonId: `${prefix}ytmp3_dl ${url} AUDIO`, buttonText: { displayText: 'Audio Type 🎵' }, type: 1 },
             { buttonId: `${prefix}ytmp3_dl ${url} DOC`, buttonText: { displayText: 'Document Type 📁' }, type: 1 },
             { buttonId: `${prefix}ytmp3_dl ${url} VOICE`, buttonText: { displayText: 'Voice Type 🎤' }, type: 1 }
             ]
     
         await conn.sendMessage(from, {
          image: { url: image },
          caption: info,
          footer: config.FOOTER,
          contextInfo: {
                externalAdReply: {
                     title: `🎶 ${botName} 𝖲𝖮𝖭𝖦 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🎶`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: url
          }},
          buttons,
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
            info += `\n${numreplyMg}\n` +
            `1.1  *Audio Type* 🎵\n` +
            `1.2  *Document Type* 📁\n` +
            `1.3  *Voice Type 🎤*\n\n` +
            `> ${config.FOOTER}`;

	const numrep = [];
        numrep.push(`1.1 ${prefix}ytmp3_dl ${url} AUDIO`);
        numrep.push(`1.2 ${prefix}ytmp3_dl ${url} DOC`);
        numrep.push(`1.3 ${prefix}ytmp3_dl ${url} VOICE`);
    
        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: `🎶 ${botName} 𝖲𝖮𝖭𝖦 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🎶`,
                                          body: config.BODY || "",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: url
                                      }}}, { quoted: mek });
        
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🎶', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'decimal'
                          }
                        await storenumrepdata(jsonmsg) 
                        }

    } catch (error) {
        console.error(error);
        await reply(errorMg, "❌");
    }
});


cmd({
    pattern: "video",
    alias: ["ytmp4", "ytmp4dl", "mp4"],
    react: "🎥",
    desc: "Download Ytmp4",
    category: "download",
    use: "video < Text or YT URL >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, prefix }) => {
    try {
        
        if (!q) return await reply(ytMg, "❓");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply(notFoundMg, "📛");
            id = searchResults.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply(notFoundMg, "📛");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        let info = `\`🎬 ${botName} 𝖸𝖳𝖬𝖯4 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🎬\`\n\n` +
            `┏━━━━━━━━━━━━━━━━━┓\n` +
            `┣ 🎵 *Title:* ${title || "Unknown"}\n` +
            `┣ ⏳ *Duration:* ${timestamp || "Unknown"}\n` +
            `┣ 👀 *Views:* ${views || "Unknown"}\n` +
            `┣ 🌏 *Release Ago:* ${ago || "Unknown"}\n` +
            `┣ 👤 *Author:* ${author?.name || "Unknown"}\n` +
            `┣ 🖇 *Url:* ${url || "Unknown"}\n` +
            `┗━━━━━━━━━━━━━━━━━┛\n` 
            
            if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
        const listData = {
          title: buttonTitle,
          sections: [
            {
              title: "📂 Video Type",
              rows: [
                { title: "144p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 144 VIDEO` },
                { title: "360p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 360 VIDEO` },
                { title: "480p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 480 VIDEO` },
                { title: "720p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 720 VIDEO` },
                { title: "1080p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 1080 VIDEO` }
              ]
            },{
              title: "🎥 Document Type",
              rows: [
                { title: "144p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 144 DOC` },
                { title: "360p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 360 DOC` },
                { title: "480p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 480 DOC` },
                { title: "720p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 720 DOC` },
                { title: "1080p Quality", description: buttonDesc, id: `${prefix}ytmp4_dl ${url} 1080 DOC` }
              ]
            }
          ]
        };
        


         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: config.FOOTER,
          contextInfo: {
                externalAdReply: {
                     title: `🎬 ${botName} 𝖸𝖳𝖬𝖯4 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🎬`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: q
          }},
          buttons: [
            {
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData)
              }
            }
          ],
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
            info += `\n${numreplyMg}\n\n` +
            `_[1] Video Type 🎥_\n` +
            `1.1  *144p Quality*\n` +
            `1.2  *360p Quality*\n` +
            `1.3  *480p Quality*\n` +
            `1.4  *720p Quality*\n` +
            `1.5  *1080p Quality*\n\n` +
            `_[2] Document Type 📂_\n` +
            `2.1  *144p Quality*\n` +
            `2.2  *360p Quality*\n` +
            `2.3  *480p Quality*\n` +
            `2.4  *720p Quality*\n` +
            `2.5  *1080p Quality*\n\n` +
            `> ${config.FOOTER}`;

	const numrep = [];
        numrep.push(`1.1 ${prefix}ytmp4_dl ${url} 144 VIDEO`);
        numrep.push(`1.2 ${prefix}ytmp4_dl ${url} 360 VIDEO`);
        numrep.push(`1.3 ${prefix}ytmp4_dl ${url} 480 VIDEO`);
        numrep.push(`1.4 ${prefix}ytmp4_dl ${url} 720 VIDEO`);
        numrep.push(`1.5 ${prefix}ytmp4_dl ${url} 1080 VIDEO`);
        numrep.push(`2.1 ${prefix}ytmp4_dl ${url} 144 DOC`);
        numrep.push(`2.2 ${prefix}ytmp4_dl ${url} 360 DOC`);
        numrep.push(`2.3 ${prefix}ytmp4_dl ${url} 480 DOC`);
        numrep.push(`2.4 ${prefix}ytmp4_dl ${url} 720 DOC`);
        numrep.push(`2.5 ${prefix}ytmp4_dl ${url} 1080 DOC`);

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: `🎬 ${botName} 𝖸𝖳𝖬𝖯4 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🎬`,
                                          body: config.BODY || "",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: url
                                      }}}, { quoted: mek });

        
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🎬', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'decimal'
                          }
                        await storenumrepdata(jsonmsg) 
                        }

        
    } catch (error) {
        console.error(error);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "ytmp3_dl",    
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        
        if (!q || !q.includes("https")) {
            return await reply(notFoundMg, "📛");
        }

        const url = q.split(" ")[0];
        const type = q.split(" ")[1].trim().toLowerCase() || 'audio';
	
        const result = await ytmp3_v2(url);
	const downloadUrl = result?.result?.download;
	    
	    if(!downloadUrl){
		    reply(downUrlNotfound, "⁉️");
		    return
	    }
	    
        await m.react("⬆️");
	    
        if(type === "audio"){
        
        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
        await m.react("✅");
            
        } else if(type === "doc"){
        
        await conn.sendMessage(from, { document: { url: downloadUrl }, fileName: `${result?.result?.title || 'N/A'}.mp4`, mimetype: "audio/mpeg", caption: `${result?.result?.title || 'N/A'}\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
            
        } else if(type === "voice"){
		
	await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/ogg; codecs=opus", ptt: true }, { quoted: mek });
	await m.react("✅");
		
        }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "ytmp4_dl",    
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        
        if (!q || !q.includes("https")) {
            return await reply(notFoundMg, "📛");
        }

        const url = q.split(" ")[0];
	const quality = q.split(" ")[1];
        const type = q.split(" ")[2].trim().toLowerCase() || 'doc';
	
        const result = await ytmp4_v2(url, quality);
	const downloadUrl = result?.download?.url;
	    
	    if(!downloadUrl){
		    reply(downUrlNotfound, "⁉️");
		    return
	    }
	    
        await m.react("⬆️");
	    
        if(type === "video"){
        
        await conn.sendMessage(from, { video: { url: downloadUrl }, caption: `${result?.result?.title || 'N/A'}\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
            
        } else if(type === "doc"){
        
        await conn.sendMessage(from, { document: { url: downloadUrl }, fileName: `${result?.result?.title || 'N/A'}.mp4`, mimetype: "video/mp4", caption: `${result?.result?.title || 'N/A'}\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
            
        }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

//============================ FACEBOOK ============================
cmd({
    pattern: "fb",
    alias: ["fbdl", "facebook"],
    react: "🏓",
    desc: "Download Fb videos",
    category: "download",
    use: "fb < Fb URL >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, prefix }) => {
    try {
        
        if (!q || !isUrl(q)) {
            return await reply(fbMg, "❓");
        }

        const response = await fbdownload(q);
        if(!response?.result?.sd && !response?.result?.hd) return await reply(fbFailMg, "❌");
        const { title, image, sd, hd } = response?.result;
        
       let info = `\`🏓 ${botName} 𝖥𝖡 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🏓\`\n\n` +
           `┏━━━━━━━━━━━━━━━━━┓\n` +
           `┣ 🎵 *Title:* ${title}\n` +
           `┗━━━━━━━━━━━━━━━━━┛\n` 
           
                      if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
        const listData = {
          title: buttonTitle,
          sections: [
            {
              title: "📂 Video Type",
              rows: [
                { title: "SD Video 🪫", description: buttonDesc, id: `${prefix}fb_dl ${sd} SD VIDEO=${title}` },
                { title: "HD Video 🔋", description: buttonDesc, id: `${prefix}fb_dl ${hd} HD VIDEO=${title}` }
              ]
            },{
              title: "🎥 Document Type",
              rows: [
                { title: "SD Video 🪫", description: buttonDesc, id: `${prefix}fb_dl ${sd} SD DOC=${title}` },
                { title: "HD Video 🔋", description: buttonDesc, id: `${prefix}fb_dl ${hd} HD DOC=${title}` }
              ]
            }
          ]
        };
        


         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: `URL: ${q}`,
          contextInfo: {
                externalAdReply: {
                     title: `🏓 ${botName} 𝖥𝖡 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🏓`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: q
          }},
          buttons: [
            {
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData)
              }
            }
          ],
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
           info += `\n${numreplyMg}\n\n` +
           `_[1] 📂 Video Type_\n` +
           `1.1  *SD Video* 🪫\n` +
           `1.2  *HD Video* 🔋\n\n` +
           `_[2] 🎥 Document Type_\n` +
           `2.1  *SD Video* 🪫\n` +
           `2.2  *HD Video* 🔋\n\n` +
           `> URL: ${q}`;

        const numrep = [];
        numrep.push(`1.1 ${prefix}fb_dl ${sd} SD VIDEO=${title}`);
        numrep.push(`1.2 ${prefix}fb_dl ${hd} HD VIDEO=${title}`);
        numrep.push(`2.1 ${prefix}fb_dl ${sd} SD DOC=${title}`);
        numrep.push(`2.2 ${prefix}fb_dl ${hd} HD DOC=${title}`);
        
        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: `🏓 ${botName} 𝖥𝖡 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🏓`,
                                          body: config.BODY || "",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: q
                                      }}}, { quoted: mek });
        
        
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🎥', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'decimal'
                          }
                        await storenumrepdata(jsonmsg) 
                        }

    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "fb_dl",    
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        
        if (!q || !q.includes("https")) {
            return await reply(notFoundMg, "📛");
        }

        const url = q.split(" ")[0];
        const quality = q.split(" ")[1];
        const type = q.split(" ")[2].split("=")[0].toLowerCase() || 'video';
        const title = q.split("=")[1] || '';

        if(type === "video"){
        const msg = await conn.sendMessage(from, { text: `📥 Downloading ${quality} Video...` }, { quoted: mek });
        await conn.sendMessage(from, { video: { url }, fileName: `${title}.mp4`, caption: `🎥 *Here is your FB Video!*\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
        await conn.sendMessage(from, { text : mediaMg , edit : msg.key })
            
        } else {
        const msg = await conn.sendMessage(from, { text: `📥 Downloading ${quality} Video...` }, { quoted: mek });
        await conn.sendMessage(from, { document: { url }, fileName: `${title}.mp4`, mimetype: "video/mp4", caption: `🎥 *Here is your FB Video!*\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
        await conn.sendMessage(from, { text : mediaMg , edit : msg.key })
            
        }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

//============================ APK ============================
cmd({
    pattern: "apk",
    alias: ["app", "apps", "application"],
    react: "📦",
    desc: "Download Apps",
    category: "download",
    use: "apk < App name >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, prefix }) => {
    try {
        
        if (!q) {
            return await reply(apkMg, "❓");
        }

        const response = await apkSearch(q);
        if(response?.length === 0) return await reply(notFoundMg, "📛");
        const numrep = [];
      
       let info = `\`📦 ${botName} 𝖠𝖯𝖪 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 📦\`\n`
       
       if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
           const rows = response.map(item => ({
             title: item.name,
             description: buttonDesc,
             id: `${prefix}apk_dl ${item.id}`
           }));
           
        const listData = {
          title: buttonTitle,
          sections: [
            {
              title: "Download Application 📦",
              rows
            }
          ]
        };
        
         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: config.FOOTER,
          contextInfo: {
                externalAdReply: {
                     title: `🕵️‍♂️ ${botName} 𝖠𝖯𝖪 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🕵️‍♂️`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: q
          }},
          buttons: [
            {
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData)
              }
            }
          ],
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
           info += "\n"
           
        for (let v = 0 ; v < response.length; v++) {
            info += `*${formatNumber(v + 1)} ||* ${response[v].name}\n`
            numrep.push(`${prefix}apk_dl ${response[v].id}`);
        }

        info += `\n> ${config.FOOTER}`
            

        const sentMsg = await conn.sendMessage(from, { text: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: `🕵️‍♂️ ${botName} 𝖠𝖯𝖪 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🕵️‍♂️`,
                                          body: config.BODY || "",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: q
                                      }}}, { quoted: mek });
        

        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🕵️‍♂️', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'nondecimal'
                          }
                        await storenumrepdata(jsonmsg)
                        }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "apk_dl",    
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        
        if (!q) {
            return await reply(notFoundMg, "📛");
        }
        
        const apkdl = await apkDownload(q);
        await conn.sendMessage(from, { react: { text: '⬆', key: mek.key } })
        if (!apkdl) return reply(notFoundMg)
	
        let msg = `📚 *ᴀᴘᴋ ɴᴀᴍᴇ :* ${apkdl.name}\n` +
        `📊 *ᴘᴀᴄᴋᴀɢᴇ :* ${apkdl.package}\n` +
        `📥 *ꜱɪᴢᴇ :* ${apkdl.size}\n` +
        `🏮 *ʟᴀꜱᴛ ᴜᴘᴅᴀᴛᴇ :* ${apkdl.lastUpdate}\n\n` +
        config.FOOTER
	
        await conn.sendMessage(from, { image: { url: apkdl.image || config.LOGO }, caption: `${msg}` }, { quoted: mek })
        const dom = await conn.sendMessage(from, { document: { url: apkdl.dl_link }, mimetype: "application/vnd.android.package-archive", fileName: apkdl.name + '.apk', caption: `${apkdl.name}\n\n${config.FOOTER}` }, { quoted: mek })
        await conn.sendMessage(from, { react: { text: '📦', key: dom.key } })
        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key } })
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});


//============================ XVIDEO ============================
cmd({
    pattern: "xvideo",
    alias: ["xv", "xvdl", "xvideodl"],
    react: "🔞",
    desc: "Download Xvideo Porn Video",
    category: "download",
    use: "xvideo < query >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, prefix }) => {
    try {

	if(config?.XVIDEO_DL !== 'true'){
	    return await reply(disXvdl, "");
	}
	    
        if (!q) {
            return await reply(needText, "❓");
        }

        const response = await xvideosSearch(q);
	const data = response
        if(data?.length === 0) return await reply(notFoundMg, "📛");
        const numrep = [];
      
       let info = `\`🍀 ${botName} 𝖷𝖵𝖨𝖣𝖤𝖮 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🍀\`\n\n`
       
       if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
           const rows = data.map(item => ({
             title: item.title,
             description: buttonDesc,
             id: `${prefix}xvid_dl ${item.url}`
           }));
           
        const listData = {
          title: buttonTitle,
          sections: [
            {
              title: "Download Xvideo Video 🍀",
              rows
            }
          ]
        };
        
         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: config.FOOTER,
          contextInfo: {
                externalAdReply: {
                     title: `🔞 ${botName} 𝖷𝖵𝖨𝖣𝖤𝖮 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🔞`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: q
          }},
          buttons: [
            {
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData)
              }
            }
          ],
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
           info += "\n"
           
        for (let v = 0 ; v < data.length; v++) {
            info += `*${formatNumber(v + 1)} ||* ${data[v].title}\n`
            numrep.push(`${prefix}xvid_dl ${data[v].url}`);
        }

        info += `\n> ${config.FOOTER}`
            

        const sentMsg = await conn.sendMessage(from, { text: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: `🔞 ${botName} 𝖷𝖵𝖨𝖣𝖤𝖮 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🔞`,
                                          body: config.BODY || "",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: q
                                      }}}, { quoted: mek });
        

        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🔞', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'nondecimal'
                          }
                        await storenumrepdata(jsonmsg)
                        }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});



cmd({
    pattern: "xvid_dl",    
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {

	if(config?.XVIDEO_DL !== 'true'){
	    return await reply(disXvdl, "");
	}
	    
        if (!q) return await reply(notFoundMg);

	const dlData = await xvideosdl(q);;

        let title = dlData?.result?.title || '';
        let downloadUrl = dlData?.result?.url || '';
        let image = dlData?.result?.thumb || config.LOGO;
	let caption = `🎬 *ᴛɪᴛʟᴇ:* ${title}
🔍 *ᴋᴇʏᴡᴏʀᴅ:* ${dlData?.result?.keyword}
👀 *ɴᴠɪᴇᴡꜱ:* ${dlData?.result?.views}
📊 *ɴᴠᴏᴛᴇ:* ${dlData?.result?.vote}
❤️ *ʟɪᴋᴇꜱ:* ${dlData?.result?.likes}
💔 *ᴅᴇꜱʟɪᴋᴇꜱ:* ${dlData?.result?.deslikes}

${config.FOOTER}`;

	const rawBuffer = await getThumbnailFromUrl(image);
        const thumbnailBuffer = await resizeThumbnail(rawBuffer);
	await m.react('⬆️');
        const dom = await conn.sendMessage(from, {
            document: { url: downloadUrl },
	    jpegThumbnail: thumbnailBuffer,
            mimetype: "video/mp4",
            fileName: title + '.mp4',
            caption
        }, { quoted: mek });

        await m.react('✔️');

    } catch (e) {
        console.error(e);
        await reply(errorMg, "❌");
    }
});


//============================ SONG ============================
cmd({
    pattern: "twitter",
    alias: ["twdl", "tw"],
    react: "🐋",
    desc: "Download Twitter videos and audio",
    category: "download",
    use: "twitter < Twitter URL >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, prefix }) => {
    try {
        
        if (!q || !isUrl(q)) {
            return await reply(twMg, "❓");
        }

        const response = await twitter(q);
        if(!response?.video_hd && !response?.video_sd) return await reply(twFailMg, "❌");
        const { video_sd, video_hd, thumb, audio, desc } = response;
        
       let info = `\`🐋 ${botName} 𝖳𝖶𝖨𝖳𝖳𝖤𝖱 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🐋\`\n\n` +
           `┏━━━━━━━━━━━━━━━━━━━┓\n` +
           `┣ 🍄 *Desc:* ${desc}\n` +
           `┗━━━━━━━━━━━━━━━━━━━┛\n` 
           
           if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
        const listData = {
          title: "Download Video 🎬",
          sections: [
            {
              title: "📂 Video Type",
              rows: [
                { title: "SD Video 🪫", description: buttonDesc, id: `${prefix}tw_dl ${video_sd} SD VIDEO=${title}` },
                { title: "HD Video 🔋", description: buttonDesc, id: `${prefix}tw_dl ${video_hd} HD VIDEO=${title}` }
              ]
            },{
              title: "🎥 Document Type",
              rows: [
                { title: "SD Video 🪫", description: buttonDesc, id: `${prefix}tw_dl ${video_sd} SD DOC=${title}` },
                { title: "HD Video 🔋", description: buttonDesc, id: `${prefix}tw_dl ${video_hd} HD DOC=${title}` }
              ]
            }
          ]
        };
        
        
        const listData2 = {
          title: "Download Audio 🎶",
          sections: [
            {
              title: "🎧 Music",
              rows: [
                { title: "Audio 🎼", description: buttonDesc, id: `${prefix}tw_dl ${audio} MUSIC AUIDO=${title}` },
                { title: "Document 📁", description: buttonDesc, id: `${prefix}tw_dl ${audio} MUSIC DOC=${title}` },
                { title: "Voice 🎤", description: buttonDesc, id: `${prefix}tw_dl ${audio} MUSIC VOICE=${title}` }
              ]
            }
          ]
        };

         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: `URL: ${url}`,
          contextInfo: {
                externalAdReply: {
                     title: `🐋 ${botName} 𝖳𝖶𝖨𝖳𝖳𝖤𝖱 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🐋`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: q
          }},
          buttons: [
            {
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData)
              }
            },{
              buttonId: "action",
              type: 4,
              buttonText: { displayText: "🔽 Select Option" },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData2)
              }
            }
          ],
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
           info += `\n${numreplyMg}\n` +
           `_[1] 📂 Video Type_\n` +
           `1.1  *SD Video* 🪫\n` +
           `1.2  *HD Video* 🔋\n\n` +
           `_[2] 🎥 Document Type_\n` +
           `2.1  *SD Video* 🪫\n` +
           `2.2  *HD Video* 🔋\n\n` +
	   `_[3] 🎧 Music_\n` +
           `3.1  *Audio* 🎼\n` +
           `3.2  *Document* 📁\n` +
	   `3.3  *Voice* 🎤\n\n` +
           `> URL: ${q}`;

	const numrep = [];
        numrep.push(`1.1 ${prefix}tw_dl ${video_sd} SD VIDEO=${title}`);
        numrep.push(`1.2 ${prefix}tw_dl ${video_hd} HD VIDEO=${title}`);
        numrep.push(`2.1 ${prefix}tw_dl ${video_sd} SD DOC=${title}`);
        numrep.push(`2.2 ${prefix}tw_dl ${video_hd} HD DOC=${title}`);
        numrep.push(`3.1 ${prefix}tw_dl ${audio} MUSIC AUDIO=${title}`);
        numrep.push(`3.2 ${prefix}tw_dl ${audio} MUSIC DOC=${title}`);
	numrep.push(`3.3 ${prefix}tw_dl ${audio} MUSIC VOICE=${title}`);

        const sentMsg = await conn.sendMessage(from, { image: { url: thumb || config.LOGO }, caption: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: `🐋 ${botName} 𝖳𝖶𝖨𝖳𝖳𝖤𝖱 𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱 🐋`,
                                          body: config.BODY || "",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: q
                                      }}}, { quoted: mek });
        
        
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🎥', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'nondecimal'
                          }
                        await storenumrepdata(jsonmsg) 
                        }
        

    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "tw_dl",    
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        
        if (!q || !q.includes("https")) {
            return await reply(notFoundMg, "📛");
        }

        const url = q.split(" ")[0];
        const quality = q.split(" ")[1];
        const type = q.split(" ")[2].split("=")[0].toLowerCase() || 'video';
        const title = q.split("=")[1] || '';

        if(quality === "MUSIC"){
		
		if(type === "audio"){
        await conn.sendMessage(from, { audio: { url }, mimetype: "audio/mpeg" }, { quoted: mek });
        await m.react("✅");
			
		} else if(type === "doc"){
        await conn.sendMessage(from, { document: { url }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: `${title}\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
			
		} else if(type === "voice"){
        await conn.sendMessage(from, { audio: { url }, mimetype: "audio/ogg; codecs=opus", ptt: true }, { quoted: mek });
        await m.react("✅");
			
	    }  
        } else if(type === "video"){
        const msg = await conn.sendMessage(from, { text: `📥 Downloading ${quality} Video...` }, { quoted: mek });
        await conn.sendMessage(from, { video: { url }, fileName: `${title}.mp4`, caption: `🎥 *Here is your FB Video!*\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
        await conn.sendMessage(from, { text : mediaMg , edit : msg.key })
            
        } else if(type === "doc"){
        const msg = await conn.sendMessage(from, { text: `📥 Downloading ${quality} Video...` }, { quoted: mek });
        await conn.sendMessage(from, { document: { url }, fileName: `${title}.mp4`, mimetype: "video/mp4", caption: `🎥 *Here is your FB Video!*\n\n> ${config.FOOTER}` }, { quoted: mek });
        await m.react("✅");
        await conn.sendMessage(from, { text : mediaMg , edit : msg.key })
            
        }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

//============================ OTHER ============================
cmd({
    pattern: "mediafire",
    alias: ["mfire", "mf", "mfdl"],
    react: "🐋",
    desc: "Download Meidafile Files",
    category: "download",
    use: "mediafire < Mediafire url >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {

        if (!q || !q.includes("www.mediafire.com")) {
            return await reply(mfireMg, "❓");
        }

        const response = await mediaFire(q);
        
        if (!response?.url) {
            return await reply(notFoundMg);
        }

        const mime = (await axios.get(response.url)).headers['content-type'] || "application/zip"
        await conn.sendMessage(from, {
            document: { url: response.url },
            mimetype: mime,
            fileName: response.filename,
            caption: `\`💾 FileName\`: ${response.title || "N/A"}\n\`💽 Size:\` ${response.size || "N/A"}\n\`📅 UploadDate:\` ${response.date || "N/A"}\n\n> ${config.FOOTER}`
        }, { quoted: mek });

        await m.react("✔");

    } catch (error) {
        console.error(error);
        await reply(errorMg, "❌");
    }
});


cmd({
    pattern: "ss",
    alias: ["screenshot", "ssdl", "screen"],
    react: "📸",
    desc: "Download website screen",
    category: "download",
    use: "ss < url >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {

        if (!q || !q.includes("http")) {
            return await reply(validUrlMg, "❓");
        }

        const url = `https://image.thum.io/get/fullpage/${q}`

        await conn.sendMessage(from, { image: { url: url }, caption: config.FOOTER, }, { quoted: mek });

        await m.react("✔");

    } catch (error) {
        console.log(error);
        await reply(errorMg, "❌");
    }
});


cmd({
    pattern: "instagram",
    alias: ["igdl", "ig", "insta"],
    react: "🎀",
    desc: "Download Instagram video",
    category: "download",
    use: "instagram < Instagram url >",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {

        if (!q || !q.includes("instagram.com")) {
            return await reply(igMg, "❓");
        }

        const response = await igdl(q);
        
        if (!response || !response.data || response.data.length === 0) {
            return await reply(errorMg);
        }

        const videoUrl = response.data[0].url;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: `🎥 *Here is your Instagram Video!*\n\n> ${config.FOOTER}`
        }, { quoted: mek });

        await m.react("✔");

    } catch (error) {
        console.log(error);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "megadl",
    alias: ["mega", "megadownload"],
    desc: "Download files from mega.nz",
    category: "download",
    react: "🍟",
    use: "megadl <mega.nz link>",
    filename: __filename
}, async (conn, mek, m, { q, reply,from }) => {
    try {
	    
        if (!q || !q.includes("mega.nz")) return await reply(megaMg);
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });

        const file = File.fromURL(q);
        const fileName = (await file.loadAttributes()).name;
        const mimeType = mime.lookup(fileName) || 'application/octet-stream';

        const chunks = [];
        const stream = file.download();

        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', async () => {
            const buffer = Buffer.concat(chunks);

            await conn.sendMessage(from, {
                document: buffer,
                fileName,
		caption: config.FOOTER,
                mimetype: mimeType
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        });

        stream.on('error', async (err) => {
            console.error(err);
            await reply(errorMgMega);
        });

    } catch (e) {
        console.error(e);
        await reply(errorMgMega);
    }
});


cmd({
    pattern: 'img',
    alias: ["img", "imgDl"],
    react: '🖼️',
    desc: 'Search and send images based on a keyword',
    category: 'download',
    use: "img <name>",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, q }) => {
    try {
        
        if (!q) {
            return await reply(imgUsage);
        }

        const response = await gis(q);
        if(response.length < 1){
            return await reply(imgNotFound)
        }

          for (const image of response.slice(0, 5)) {
            await conn.sendMessage(from, {
                image: { url: image.url },
                caption: `🔍 *Search:* ${q}\n\n${config.FOOTER}`
            }, { quoted: mek })
        }

    } catch (error) {
        console.error('Error fetching images:', error);
        await reply(imgFetchError);
    }
});



cmd({
    pattern: "gdrive",
    alias: ["googledrive", "gd"],
    react: '📑',
    desc: "Download Google Drive files.",
    category: "download",
    use: 'gdrive < Googledrive link >',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return await reply(gdMsg);

        let res = await fg.GDriveDl(q);
        
        if (!res || !res.downloadUrl) {
            return await reply(notFoundMg);
        }

        await reply(`*📃 File Name:* ${res.fileName}
*💈 File Size:* ${res.fileSize}
*🕹️ File Type:* ${res.mimetype}`);        

        await conn.sendMessage(from, { 
            document: { url: res.downloadUrl }, 
            fileName: res.fileName, 
            mimetype: res.mimetype 
        }, { quoted: mek });

        await m.react("✔");

    } catch (e) {
        console.error(e);
         await reply(errorMg, "❌");
    }
});


cmd({
  pattern: "downurl",
  alias: ["download", "dl", "direct"],
  desc: "Download file from direct download URL",
  category: "download",
  react: "⬆️",
  use: ".downurl <direct_url>",
  filename: __filename,
},
async (conn, mek, m, { q, reply, from, prefix }) => {

  try {
    if (!q || !q.startsWith("http")) {
      return reply(neddDirectUrl + `: ${prefix}downurl https://example.com/file.mp4_`);
    }

    const smsg = await conn.sendMessage(from, { text: "📥 *Downloading File...*" }, { quoted:mek });
    
    const headRes = await axios.head(q);
    const contentType = fileName.includes('.mkv') ? 'video/mkv' : fileName.includes('.mp4') ? 'video/mp4' : headRes.headers["content-type"] ? headRes.headers["content-type"] : "application/octet-stream";
    const disposition = headRes.headers["content-disposition"];

    let filename = "file";
    if (disposition && /filename="?(.+?)"?($|;)/i.test(disposition)) {
      filename = decodeURIComponent(disposition.match(/filename="?(.+?)"?($|;)/i)[1]);
    } else {
      filename = decodeURIComponent(new URL(q).pathname.split("/").pop() || "file");
    }

    filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_"); // sanitize

    await conn.sendMessage(from, { text : "⬆️ *Uploading file...*", edit : smsg.key });

	  try{  
          await conn.sendMessage(from, { document: { url: q }, fileName: filename, mimetype: contentType, caption: `${filename}\n\n\n${config.CAPTION || config.FOOTER}` }, { quoted: mek })
	  } catch(e) {
	  await conn.sendMessage(from, { document: { url: await getBuffer(q) }, fileName: filename, mimetype: contentType, caption: `${filename}\n\n\n${config.CAPTION || config.FOOTER}` }, { quoted: mek })  	  
	  }
	  
	  await conn.sendMessage(from, { delete: smsg.key });
	   
  } catch (err) {
    console.log(err);
     await reply(errorMg, "❌");
  }
});
  
