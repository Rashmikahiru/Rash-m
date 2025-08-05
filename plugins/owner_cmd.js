const config = require('../config');
const os = require('os');
const fs = require('fs');
const path = require("path");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');
const { exec } = require("child_process");
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, getDateAndTime, tr } = require('../lib/functions');
const { saveAutoReply, deleteAutoReply, updateAutoReply, deleteAllAutoReplies, getAllReplies, findReplies, handleAutoReply } = require('../lib/mongodb');
const DBM = require("../lib/database");
const dbData = require("../lib/config");
const { resetMovie } = require("../lib/movie_db");
const moment = require("moment-timezone");
const ymd_db = new DBM();
const tableName = dbData.tableName;
const key = dbData.key;
const { storenumrepdata } = require('../lib/numreply-db');
function formatNumber(num) {
    return String(num).padStart(2, '0');
} 

const { buttonDesc, buttonTitle } = require('../lib/config');
// ============================= L A N G U A G E =============================
var errorMg, ownerMg, replyMg, invalidReply, validLinkMg, pfError, pfInvalid, pfNotFound, pfMention, badApply, restartMg, rsMg, dbReset, latestHave;

    errorMg = '*An error occurred, please try again later ❌*';
    ownerMg = '🚫 *You are not authorized to use this command!*';
    replyMg = '❗ *Please reply to a message*';
    invalidReply = '❌ Invalid choice! Reply with ';
    validLinkMg = '*Please provide a valid link*';
    pfError = "❌ *Something went wrong fetching profile picture.*";
    pfInvalid = "❌ *Invalid number.*";
    pfNotFound = "❌ *Couldn't fetch profile picture. Maybe it's private.*";
    pfMention = "🧑 *Mention a user or provide number to get their profile picture.*";
    badApply = " : Invalid input! Please check format. ⛔";
    rsMg = '✅ *Bot restarted successfully!*';
    restartMg = '```♻️ Restarting bot...```';
    dbReset = "*✅ DATABASE Resetting... Restarting bot*";
    latestHave = "*You have already updated to the latest version. 🛠️*";
    

let lang = "en";
// ============================= F U N C T I O N S =============================


// ============================= C M D =============================
cmd({
    pattern: "apply",
    react: "🗃",
    alias: ["set"],
    desc: "Apply a setting or tag a message",
    category: "owner",
    use: 'apply < Mention text msg >',
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwners, prefix }) => {
    try {
        
        if (!isOwners) return await reply(ownerMg);
        const text = m?.quoted?.type === "conversation" ? m?.quoted?.conversation : false;
        if(!text){
            const msg = await conn.sendMessage(from, { text: `*${await tr("Please reply a text message ❌", lang)}*` }, { quoted: mek });
            await conn.sendMessage(from, { react: { text: '❓', key: msg.key } });
            return
        }
        
       let info = `\`🗃 𝖸𝖠𝖲𝖨𝖸𝖠-𝖬𝖣 𝖣𝖠𝖳𝖠𝖡𝖠𝖲𝖤 𝖬𝖠𝖭𝖠𝖦𝖤𝖬𝖤𝖭𝖳 🗃\`\n\n`
          
               if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
           const rows = [
               { title: "PREFIX", description: buttonDesc, id: `${prefix}setenv PREFIX ${text}` },
               { title: "OWNER_NUMBER", description: buttonDesc, id: `${prefix}setenv OWNER_NUMBER ${text}` },
               { title: "OWNER_NAME", description: buttonDesc, id: `${prefix}setenv OWNER_NAME ${text}` },
               { title: "OWNER_EMOJI", description: buttonDesc, id: `${prefix}setenv OWNER_REACT_EMOJI ${text}` },
               { title: "ALIVE_MESSAGE", description: buttonDesc, id: `${prefix}setenv ALIVE_MESSAGE ${text}` },
               { title: "ALIVE_LOGO", description: buttonDesc, id: `${prefix}setenv ALIVE_LOGO ${text}` },
               { title: "ANTI_DELETE_SEND", description: buttonDesc, id: `${prefix}setenv ANTI_DELETE_SEND ${text}` },
               { title: "ANTI_BAD_VALUE", description: buttonDesc, id: `${prefix}setenv ANTI_BAD_VALUE ${text}` },
               { title: "ANTI_LINK_VALUE", description: buttonDesc, id: `${prefix}setenv ANTI_LINK_VALUE ${text}` },
               { title: "CAPTION", description: buttonDesc, id: `${prefix}setenv CAPTION ${text}` },
               { title: "FILE_NAME", description: buttonDesc, id: `${prefix}setenv FILE_NAME ${text}` },
               { title: "SEEDR_EMAIL", description: buttonDesc, id: `${prefix}setenv SEEDE_EMAIL ${text}` },
               { title: "SEEDR_PASSWORD", description: buttonDesc, id: `${prefix}setenv SEEDR_PASSWORD ${text}` },
               { title: "MOVIE_DETAILS_CARD", description: buttonDesc, id: `${prefix}setenv MOVIE_DETAILS_CARD ${text}` },
               { title: "EPISODE_DETAILS_CARD", description: buttonDesc, id: `${prefix}setenv EPISODE_DETAILS_CARD ${text}` }
           ]
           
        const listData = {
          title: buttonTitle,
          sections: [
            {
              title: "Update a specific environment config setting",
              rows
            }
          ]
        };
        
         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: `Text: ${text}`,
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

                   info +=  `┏━━━━━━━━━━━━━━━━━━━┓\n` +
           `┣ 01. Set PREFIX \n` +
           `┣ 02. Set OWNER_NUMBER\n` +
           `┣ 03. Set OWNER_NAME\n` +
           `┣ 04. Set OWNER_EMOJI\n` +
           `┣ 05. Set ALIVE_MESSAGE\n` +
           `┣ 06. Set ALIVE_LOGO\n` +
           `┣ 07. Set ANTI_DELETE_SEND\n` +
           `┣ 08. Set ANTI_BAD_VALUE\n` +
           `┣ 09. Set ANTI_LINK_VALUE\n` +
           `┣ 10. Set CAPTION\n` +
           `┣ 11. Set FILE_NAME\n` +
           `┣ 12. Set SEEDR_EMAIL\n` +
           `┣ 13. Set SEEDR_PASSWORD\n` +
           `┣ 14. Set TIME_ZONE\n` +
           `┣ 15. Set MOVIE_DETAILS_CARD\n` +
           `┣ 16. Set EPISODE_DETAILS_CARD\n` +
           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
           `> Text: ${text}`
                   
        const numrep = [];
        numrep.push(`${prefix}setenv PREFIX ${text}`);
        numrep.push(`${prefix}setenv OWNER_NUMBER ${text}`);
        numrep.push(`${prefix}setenv OWNER_NAME ${text}`);
        numrep.push(`${prefix}setenv OWNER_REACT_EMOJI ${text}`);
        numrep.push(`${prefix}setenv ALIVE_MESSAGE ${text}`);
        numrep.push(`${prefix}setenv ALIVE_LOGO ${text}`);
        numrep.push(`${prefix}setenv ANTI_DELETE_SEND ${text}`);
        numrep.push(`${prefix}setenv ANTI_BAD_VALUE ${text}`);
        numrep.push(`${prefix}setenv ANTI_LINK_VALUE ${text}`);
        numrep.push(`${prefix}setenv CAPTION ${text}`);
        numrep.push(`${prefix}setenv FILE_NAME ${text}`);
        numrep.push(`${prefix}setenv SEEDR_EMAIL ${text}`);
        numrep.push(`${prefix}setenv SEEDR_PASSWORD ${text}`);
        numrep.push(`${prefix}setenv TIME_ZONE ${text}`);
        numrep.push(`${prefix}setenv MOVIE_DETAILS_CARD ${text}`);
        numrep.push(`${prefix}setenv EPISODE_DETAILS_CARD ${text}`);
       
        const sentMsg = await conn.sendMessage(from, { image: { url: config.LOGO }, text: info }, { quoted: mek });
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🛡', key: sentMsg.key } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'nondecimal'
                          }
                        await storenumrepdata(jsonmsg);                   

                   
               }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});

cmd({
    pattern: "setting",
    react: "🗃",
    alias: ["settings",],
    desc: "Manage bot settings",
    category: "owner",
    use: 'setting',
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwners, prefix }) => {
    try {
        
        if (!isOwners) return await reply(ownerMg);

       let info = `╭━━━❰ 𝙔𝘼𝙎𝙄𝙔𝘼-𝙈𝘿 𝙎𝙀𝙏𝙏𝙄𝙉𝙂 𝙈𝙀𝙉𝙐 ❱━━━━━╮\n\n`
          
               if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
           
const listData = {
  title: buttonTitle,
  sections: [
    {
      title: "ANTI_CALL",
      rows: [
        { title: "Enable", description: "Set ANTI_CALL to true", id: `${prefix}setenv ANTI_CALL true` },
        { title: "Disable", description: "Set ANTI_CALL to false", id: `${prefix}setenv ANTI_CALL false` }
      ]
    },
    {
      title: "ANTI_LINK_ACTION",
      rows: [
        { title: "Delete Only", description: "Only delete links", id: `${prefix}setenv ANTI_LINK_ACTION delete` },
        { title: "Delete + Remove", description: "Delete and remove sender", id: `${prefix}setenv ANTI_LINK_ACTION kick` }
      ]
    },
    {
      title: "ANTI_BAD_ACTION",
      rows: [
        { title: "Delete Only", description: "Only delete bad words", id: `${prefix}setenv ANTI_BAD_ACTION delete` },
        { title: "Delete + Remove", description: "Delete and remove sender", id: `${prefix}setenv ANTI_BAD_ACTION kick` }
      ]
    },
    {
      title: "ANTI_CALL_ACTION",
      rows: [
        { title: "Cut", description: "Cut the call", id: `${prefix}setenv ANTI_CALL_ACTION cut` },
        { title: "Block", description: "Block the caller", id: `${prefix}setenv ANTI_CALL_ACTION block` }
      ]
    },
    {
      title: "ANTI_DELETE",
      rows: [
        { title: "Enable", description: "Set ANTI_DELETE to true", id: `${prefix}setenv ANTI_DELETE true` },
        { title: "Disable", description: "Set ANTI_DELETE to false", id: `${prefix}setenv ANTI_DELETE false` }
      ]
    },
    {
      title: "AUTO_REACT",
      rows: [
        { title: "Enable", description: "Auto react to messages", id: `${prefix}setenv AUTO_REACT true` },
        { title: "Disable", description: "Disable auto reaction", id: `${prefix}setenv AUTO_REACT false` }
      ]
    },
    {
      title: "AUTO_BLOACK",
      rows: [
        { title: "Enable", description: "Auto block callers", id: `${prefix}setenv AUTO_BLOACK true` },
        { title: "Disable", description: "Disable auto block", id: `${prefix}setenv AUTO_BLOACK false` }
      ]
    },
    {
      title: "AUTO_READ_MESSAGE",
      rows: [
        { title: "Enable", description: "Auto read all messages", id: `${prefix}setenv AUTO_READ_MESSAGE true` },
        { title: "Disable", description: "Disable auto read", id: `${prefix}setenv AUTO_READ_MESSAGE false` }
      ]
    },
    {
      title: "AUTO_READ_STATUS",
      rows: [
        { title: "Enable", description: "Auto read all statuses", id: `${prefix}setenv AUTO_READ_STATUS true` },
        { title: "Disable", description: "Disable auto read", id: `${prefix}setenv AUTO_READ_STATUS false` }
      ]
    },
    {
      title: "AUTO_REACT_STATUS",
      rows: [
        { title: "Enable", description: "Auto react to statuses", id: `${prefix}setenv AUTO_REACT_STATUS true` },
        { title: "Disable", description: "Disable auto react", id: `${prefix}setenv AUTO_REACT_STATUS false` }
      ]
    },
    {
      title: "AUTO_WELCOME_MESSAGE",
      rows: [
        { title: "Enable", description: "Welcome new users", id: `${prefix}setenv AUTO_SEND_WELLCOME_MESSAGE true` },
        { title: "Disable", description: "Don't send welcome", id: `${prefix}setenv AUTO_SEND_WELLCOME_MESSAGE false` }
      ]
    },
    {
      title: "AUTO_VOICE",
      rows: [
        { title: "Enable", description: "Enable voice auto reply", id: `${prefix}setenv AUTO_VOICE true` },
        { title: "Disable", description: "Disable auto voice", id: `${prefix}setenv AUTO_VOICE false` }
      ]
    },
    {
      title: "AUTO_STICKER",
      rows: [
        { title: "Enable", description: "Enable sticker auto reply", id: `${prefix}setenv AUTO_STICKER true` },
        { title: "Disable", description: "Disable auto sticker", id: `${prefix}setenv AUTO_STICKER false` }
      ]
    },
    {
      title: "AUTO_REPLY",
      rows: [
        { title: "Enable", description: "Enable auto replies", id: `${prefix}setenv AUTO_REPLY true` },
        { title: "Disable", description: "Disable auto reply", id: `${prefix}setenv AUTO_REPLY false` }
      ]
    },
    {
      title: "AUTO_RECODING",
      rows: [
        { title: "Enable", description: "Show recording status", id: `${prefix}setenv AUTO_RECODING true` },
        { title: "Disable", description: "Hide recording status", id: `${prefix}setenv AUTO_RECODING false` }
      ]
    },
    {
      title: "AUTO_TYPING",
      rows: [
        { title: "Enable", description: "Show typing status", id: `${prefix}setenv AUTO_TYPING true` },
        { title: "Disable", description: "Hide typing status", id: `${prefix}setenv AUTO_TYPING false` }
      ]
    },
    {
      title: "ALLWAYS_ONLINE",
      rows: [
        { title: "Enable", description: "Always show online", id: `${prefix}setenv ALLWAYS_ONLINE true` },
        { title: "Disable", description: "Normal online behavior", id: `${prefix}setenv ALLWAYS_ONLINE false` }
      ]
    },
    {
      title: "WORK_TYPE",
      rows: [
        { title: "Public", description: "Bot works for everyone", id: `${prefix}setenv WORK_TYPE public` },
        { title: "Private", description: "Only owner can use", id: `${prefix}setenv WORK_TYPE private` },
        { title: "Only Group", description: "Bot works in groups only", id: `${prefix}setenv WORK_TYPE only_group` },
        { title: "Only Inbox", description: "Bot works in inbox only", id: `${prefix}setenv WORK_TYPE inbox` }
      ]
    },
    {
      title: "LANG",
      rows: [
        { title: "English", description: "Set language to English", id: `${prefix}setenv LANG EN` },
        { title: "Sinhala", description: "Set language to Sinhala", id: `${prefix}setenv LANG SI` },
        { title: "Tamil", description: "Set language to Tamil", id: `${prefix}setenv LANG TA` },
        { title: "Hindi", description: "Set language to Hindi", id: `${prefix}setenv LANG HI` }
      ]
    },
    {
      title: "AI_MODE",
      rows: [
        { title: "Enable", description: "Enable AI features", id: `${prefix}setenv AI_MODE true` },
        { title: "Disable", description: "Disable AI mode", id: `${prefix}setenv AI_MODE false` }
      ]
    },
    {
      title: "OWNER_REACT",
      rows: [
        { title: "Enable", description: "React when owner sends message", id: `${prefix}setenv OWNER_REACT true` },
        { title: "Disable", description: "Don't auto react to owner", id: `${prefix}setenv OWNER_REACT false` }
      ]
    },
    {
  title: "XVIDEO_DL",
  rows: [
    {
      title: "Enable",
      description: "Allow users to use XVideo download commands.",
      id: `${prefix}setenv XVIDEO_DL true`
    },
    {
      title: "Disable",
      description: "Disable all XVideo download commands.",
      id: `${prefix}setenv XVIDEO_DL false`
    }
  ]
},
{
  title: "MOVIE_DL",
  rows: [
    {
      title: "Only Me",
      description: "Only you (the sender) can use movie download commands.",
      id: `${prefix}setenv MOVIE_DL only_me`
    },
    {
      title: "Only Owners",
      description: "Restrict movie downloads to bot owners only.",
      id: `${prefix}setenv MOVIE_DL only_owners`
    },
    {
      title: "All",
      description: "Everyone can use movie download commands.",
      id: `${prefix}setenv MOVIE_DL all`
    },
    {
      title: "Disable",
      description: "Completely disable movie downloading.",
      id: `${prefix}setenv MOVIE_DL disable`
    }
  ]
}
  ]
};

        
         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: config.FOOTER,
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

                   info +=  `┃ 🛑 ANTI_CALL
┃    ┣ 1.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 1.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🔗 ANTI_LINK_ACTION
┃    ┣ 2.1 ➤ ᴅᴇʟᴇᴛᴇ ᴏɴʟʏ
┃    ┗ 2.2 ➤ ᴅᴇʟᴇᴛᴇ + ʀᴇᴍᴏᴠᴇ

┃ 🤬 ANTI_BAD_ACTION
┃    ┣ 3.1 ➤ ᴅᴇʟᴇᴛᴇ ᴏɴʟʏ
┃    ┗ 3.2 ➤ ᴅᴇʟᴇᴛᴇ + ʀᴇᴍᴏᴠᴇ

┃ 📞 ANTI_CALL_ACTION
┃    ┣ 4.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 4.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🗑️ ANTI_DELETE
┃    ┣ 5.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 5.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ ❤️ AUTO_REACT
┃    ┣ 6.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 6.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🚫 AUTO_BLOACK
┃    ┣ 7.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 7.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 📩 AUTO_READ_MESSAGE
┃    ┣ 8.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 8.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 👁️ AUTO_READ_STATUS
┃    ┣ 9.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 9.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🔁 AUTO_REACT_STATUS
┃    ┣ 10.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 10.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🙏 AUTO_WELCOME_MESSAGE
┃    ┣ 11.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 11.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🎙️ AUTO_VOICE
┃    ┣ 12.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 12.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🧽 AUTO_STICKER
┃    ┣ 13.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 13.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🤖 AUTO_REPLY
┃    ┣ 14.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 14.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🎥 AUTO_RECODING
┃    ┣ 15.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 15.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ ⌨️ AUTO_TYPING
┃    ┣ 16.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 16.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🌐 ALLWAYS_ONLINE
┃    ┣ 17.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 17.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🛠️ WORK_TYPE
┃    ┣ 18.1 ➤ ᴘᴜʙʟɪᴄ
┃    ┣ 18.2 ➤ ᴘʀɪᴠᴀᴛᴇ
┃    ┣ 18.3 ➤ ᴏɴʟʏ ɢʀᴏᴜᴘ
┃    ┗ 18.4 ➤ ᴏɴʟʏ ɪɴʙᴏx

┃ 🌍 LANG
┃    ┣ 19.1 ➤ ᴇɴɢʟɪꜱʜ
┃    ┣ 19.2 ➤ ꜱɪɴʜᴀʟᴀ
┃    ┣ 19.3 ➤ ᴛᴀᴍɪʟ
┃    ┗ 19.4 ➤ ʜɪɴᴅɪ

┃ 🧠 AI_MODE
┃    ┣ 20.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 20.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 👑 OWNER_REACT
┃    ┣ 21.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 21.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🔞 XVIDEO_DL
┃    ┣ 22.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 22.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🎥 MOVIE_DL
┃    ┣ 23.1 ➤ ᴏɴʟʏ ᴍᴇ
┃    ┗ 23.2 ➤ ᴏɴʟʏ ᴏᴡɴᴇʀꜱ 
┃    ┣ 23.3 ➤ ᴀʟʟ 
┃    ┗ 23.4 ➤ ᴅɪꜱᴀʙʟᴇ

╰━━━━━━━━━━━━━━━━━━━━╯

${config.FOOTER}

`
                   
const numrep = [];

numrep.push(`1.1 ${prefix}setenv ANTI_CALL true`);
numrep.push(`1.2 ${prefix}setenv ANTI_CALL false`);

numrep.push(`2.1 ${prefix}setenv ANTI_LINK_ACTION delete`);
numrep.push(`2.2 ${prefix}setenv ANTI_LINK_ACTION kick`);

numrep.push(`3.1 ${prefix}setenv ANTI_BAD_ACTION delete`);
numrep.push(`3.2 ${prefix}setenv ANTI_BAD_ACTION kick`);

numrep.push(`4.1 ${prefix}setenv ANTI_CALL_ACTION cut`);
numrep.push(`4.2 ${prefix}setenv ANTI_CALL_ACTION block`);

numrep.push(`5.1 ${prefix}setenv ANTI_DELETE true`);
numrep.push(`5.2 ${prefix}setenv ANTI_DELETE false`);

numrep.push(`6.1 ${prefix}setenv AUTO_REACT true`);
numrep.push(`6.2 ${prefix}setenv AUTO_REACT false`);

numrep.push(`7.1 ${prefix}setenv AUTO_BLOACK true`);
numrep.push(`7.2 ${prefix}setenv AUTO_BLOACK false`);

numrep.push(`8.1 ${prefix}setenv AUTO_READ_MESSAGE true`);
numrep.push(`8.2 ${prefix}setenv AUTO_READ_MESSAGE false`);

numrep.push(`9.1 ${prefix}setenv AUTO_READ_STATUS true`);
numrep.push(`9.2 ${prefix}setenv AUTO_READ_STATUS false`);

numrep.push(`10.1 ${prefix}setenv AUTO_REACT_STATUS true`);
numrep.push(`10.2 ${prefix}setenv AUTO_REACT_STATUS false`);

numrep.push(`11.1 ${prefix}setenv AUTO_SEND_WELLCOME_MESSAGE true`);
numrep.push(`11.2 ${prefix}setenv AUTO_SEND_WELLCOME_MESSAGE false`);

numrep.push(`12.1 ${prefix}setenv AUTO_VOICE true`);
numrep.push(`12.2 ${prefix}setenv AUTO_VOICE false`);

numrep.push(`13.1 ${prefix}setenv AUTO_STICKER true`);
numrep.push(`13.2 ${prefix}setenv AUTO_STICKER false`);

numrep.push(`14.1 ${prefix}setenv AUTO_REPLY true`);
numrep.push(`14.2 ${prefix}setenv AUTO_REPLY false`);

numrep.push(`15.1 ${prefix}setenv AUTO_RECODING true`);
numrep.push(`15.2 ${prefix}setenv AUTO_RECODING false`);

numrep.push(`16.1 ${prefix}setenv AUTO_TYPING true`);
numrep.push(`16.2 ${prefix}setenv AUTO_TYPING false`);

numrep.push(`17.1 ${prefix}setenv ALLWAYS_ONLINE true`);
numrep.push(`17.2 ${prefix}setenv ALLWAYS_ONLINE false`);

numrep.push(`18.1 ${prefix}setenv WORK_TYPE public`);
numrep.push(`18.2 ${prefix}setenv WORK_TYPE private`);
numrep.push(`18.3 ${prefix}setenv WORK_TYPE only_group`);
numrep.push(`18.4 ${prefix}setenv WORK_TYPE inbox`);

numrep.push(`19.1 ${prefix}setenv LANG EN`);
numrep.push(`19.2 ${prefix}setenv LANG SI`);
numrep.push(`19.3 ${prefix}setenv LANG TA`);
numrep.push(`19.4 ${prefix}setenv LANG HI`);

numrep.push(`20.1 ${prefix}setenv AI_MODE true`);
numrep.push(`20.2 ${prefix}setenv AI_MODE false`);

numrep.push(`21.1 ${prefix}setenv OWNER_REACT true`);
numrep.push(`21.2 ${prefix}setenv OWNER_REACT false`);

numrep.push(`22.1 ${prefix}setenv XVIDEO_DL true`);
numrep.push(`22.2 ${prefix}setenv XVIDEO_DL false`);

numrep.push(`23.1 ${prefix}setenv MOVIE_DL only_me`);
numrep.push(`23.2 ${prefix}setenv MOVIE_DL only_owners`);
numrep.push(`23.3 ${prefix}setenv MOVIE_DL all`);
numrep.push(`23.4 ${prefix}setenv MOVIE_DL disable`);

       
        const sentMsg = await conn.sendMessage(from, { image: { url: config.LOGO }, text: info }, { quoted: mek });
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🛡', key: sentMsg.key } });
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
    pattern: "sudo",
    react: "👨🏻‍🔧",
    alias: ["setsudo"],
    desc: "Change sudo access",
    category: "owner",
    use: 'sudo < Mention user ||  >',
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwners, prefix, isGroup }) => {
    try {
        
        if (!isOwners) return await reply(ownerMg);
         let user = null;

        if (isGroup) {
            user = m.quoted?.sender || m?.mentionUser?.[0] || from;
        } else {
            user = from;
        }

        if (
          !user ||
          (
            !user.endsWith('@g.us') &&
            !user.endsWith('@s.whatsapp.net') &&
            !user.endsWith('@lid')
          )
        ) {
          const msg = await conn.sendMessage(from, { text: `*${await tr("Please specify a valid user. ❌", lang)}*` }, { quoted: mek });
          await conn.sendMessage(from, { react: { text: '❓', key: msg.key } });
          return;
        }

        let userTag = 'User Jid';
        if (user.endsWith('@g.us')) userTag = 'Group Jid';
        else if (user.endsWith('@lid')) userTag = 'User Lid';

       let info = `\`👨🏻‍🔧 𝖸𝖠𝖲𝖨𝖸𝖠-𝖬𝖣 𝖲𝖴𝖣𝖮 𝖬𝖠𝖭𝖠𝖦𝖤𝖬𝖤𝖭𝖳 👨🏻‍🔧\`\n\n`
          
               if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
           const rows = [
               { title: "Add SUDO_NUMBERS", description: buttonDesc, id: `${prefix}set_sudo SUDO_NUMBERS add ${user}` },
               { title: "Delete SUDO_NUMBERS", description: buttonDesc, id: `${prefix}set_sudo SUDO_NUMBERS delete ${user}` },
               { title: "Add BAND_USERS", description: buttonDesc, id: `${prefix}set_sudo BAND_USERS add ${user}` },
               { title: "Delete BAND_USERS", description: buttonDesc, id: `${prefix}set_sudo BAND_USERS delete ${user}` },
               { title: "Add SUDO_GROUPS", description: buttonDesc, id: `${prefix}set_sudo SUDO_GROUPS add ${user}` },
               { title: "Delete SUDO_GROUPS", description: buttonDesc, id: `${prefix}set_sudo SUDO_GROUPS delete ${user}` },
               { title: "Add BAND_GROUPS", description: buttonDesc, id: `${prefix}set_sudo BAND_GROUPS add ${user}` },
               { title: "Delete BAND_GROUPS", description: buttonDesc, id: `${prefix}set_sudo BAND_GROUPS delete ${user}` }
           ]
           
        const listData = {
          title: buttonTitle,
          sections: [
            {
              title: "Change sudo access",
              rows
            }
          ]
        };
        
         await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: info,
          footer: `${userTag}: ${text}`,
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
 
            info +=  `┏━━━━━━━━━━━━━━━━━━━┓\n` +
           `┣ 01. Add SUDO_NUMBERS\n` +
           `┣ 02. Delete SUDO_NUMBERS\n` +
           `┣ 03. Add BAND_USERS\n` +
           `┣ 04. Delete BAND_USERS\n` +
           `┣ 05. Add SUDO_GROUPS\n` +
           `┣ 06. Delete SUDO_GROUPS\n` +
           `┣ 07. Add BAND_GROUPS\n` +
           `┣ 08. Delete BAND_GROUPS\n` +
           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
           `> ${userTag}: ${user}`
                   
        const numrep = [];
        numrep.push(`${prefix}set_sudo SUDO_NUMBERS add ${user}`);
        numrep.push(`${prefix}set_sudo SUDO_NUMBERS delete ${user}`);
        numrep.push(`${prefix}set_sudo BAND_USERS add ${user}`);
        numrep.push(`${prefix}set_sudo BAND_USERS delete ${user}`);
        numrep.push(`${prefix}set_sudo SUDO_GROUPS add ${user}`);
        numrep.push(`${prefix}set_sudo SUDO_GROUPS delete ${user}`);
        numrep.push(`${prefix}set_sudo BAND_GROUPS add ${user}`);
        numrep.push(`${prefix}set_sudo BAND_GROUPS delete ${user}`);

       
        const sentMsg = await conn.sendMessage(from, { image: { url: config.LOGO }, text: info }, { quoted: mek });
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🛡', key: sentMsg.key } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'nondecimal'
                          }
                        await storenumrepdata(jsonmsg);                   

                   
               }
        
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});


cmd({
  pattern: "setenv",
  react: "👨🏻‍🔧",
  ontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, reply, isOwners, args }) => {
  try {
    if (!isOwners) return await reply(ownerMg);

    const [setting, ...valueParts] = args;
    const data = valueParts.join(" ").trim();

    if (!setting || !data) {
      return reply(`⚠️ Usage: ${config.PREFIX}setenv <setting> <value>`);
    }

if (setting === 'PREFIX') {
    const allowedPattern = /^[~@#$%^&*()_+{}|":<>?/.,';\][=\-]{1}$/;
    if (!allowedPattern.test(data)) return reply(setting + badApply);

} else if (setting === 'LOGO') {
    if (!data.startsWith('https://')) return reply(setting + badApply);

} else if (setting === 'OWNER_NUMBER') {
    if (!/^\d{10,15}$/.test(data)) return reply(setting + badApply);

} else if (setting === 'OWNER_REACT_EMOJI') {
    if (!/\p{Emoji}/u.test(data)) return reply(setting + badApply);
    
} else if (setting === 'TIME_ZONE') {
    if (!moment.tz.zone(data)) return reply(setting + badApply);
}


    let olddata = await ymd_db.get(tableName, key, setting);
    if (data === olddata) {
      return reply(`*${await tr("This is already set", lang)} ✔*`);
    }

    await ymd_db.input(tableName, key, setting, data);
    await reply(`*🔁 ${setting.toUpperCase()} UPDATE:*\n\n👨🏻‍🔧 ➠ [ "${data}" ]`);

    await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

    if(setting === 'LANG'){
        const { exec } = require("child_process");
        exec(`pm2 restart ${require("../package.json").name}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                return reply(errorMg);
            }
        });
    } else if(setting === "XVIDEO_DL"){
        await reply(`*${await tr('Please note that YASIYA-MD owners do not assume any responsibility for enabling the 18+ downloader. ‼️', lang)}*`);
    }

  } catch (e) {
    console.error("❌ setenv command error:", e);
    await reply(`*${await tr("❌ An error occurred while updating.", lang)}*`);
  }
});


cmd({
  pattern: "set_sudo",
  react: "👨🏻‍🔧",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, reply, isOwners, args }) => {
  try {
    if (!isOwners) return await reply(ownerMg);

    const [setting, action, ...valueParts] = args;
    const data = valueParts.join(" ").trim();

    if (!setting || !action || !data) {
      return reply(`⚠️ Usage: ${config.PREFIX}set_sudo <setting> <add/remove> <value>`);
    }

    // Validate data format
    let isValid = false;

    if (setting === "SUDO_NUMBERS" || setting === "BAND_USERS") {
        isValid = /^\d{10,20}@(s\.whatsapp\.net|lid)$/.test(data);
    } else if (setting === "SUDO_GROUPS" || setting === "BAND_GROUPS") {
        isValid = /^\d{10,20}@g\.us$/.test(data);
    }

      if (!isValid) return reply(await tr(`*❌ Invalid value format for ${setting}*`, lang));

    // Utility
    const isInList = async () => {
      const getdata = await ymd_db.get(tableName, key, setting);
      if (!Array.isArray(getdata)) return false;
      return getdata.includes(data);
    };

    let olddata = await ymd_db.get(tableName, key, setting);
    if (!Array.isArray(olddata)) olddata = [];

    if (action === 'add') {
      if (await isInList()) return await reply(await tr("*⚠️ Already Exists*", lang));

      olddata.push(data);
      await ymd_db.input(tableName, key, setting, olddata);
      await reply(`✅ *${data} added to ${setting}*`);
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

    } else if (action === 'delete') {
      if (!await isInList()) return await reply(await tr("*⚠️ Not Found in List*", lang));

      const index = olddata.indexOf(data);
      if (index !== -1) olddata.splice(index, 1);

      await ymd_db.input(tableName, key, setting, olddata);
      await reply(`✅ *${data} removed from ${setting}*`);
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

    } else {
      return await reply(await tr("⚠️ Action must be `add` or `delete`.", lang));
    }

  } catch (e) {
    console.error("❌ set_sudo command error:", e);
    await reply(`*${await tr("An error occurred while updating.", lang)}*`);
  }
});

cmd({
    pattern: "restart",
    react: "🔁",
    desc: "To restart bot",
    category: "owner",
    use: "restart",
    filename: __filename
},
async (conn, mek, m, { reply, isOwners, from }) => {
    try { 
        if (!isOwners) return await reply(ownerMg);

        const { exec } = require("child_process");
        await reply(restartMg);
        
        exec(`pm2 restart ${require("../package.json").name}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                return reply(errorMg);
            }
           reply(rsMg);
        });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        await reply(errorMg);
    }
});

cmd({
    pattern: "resetdb",
    react: "🗃️",
    desc: "Reset database and restart bot.",
    category: "owner",
    use: "resetdb",
    filename: __filename
},
async (conn, mek, m, { reply, isOwners, from }) => {
    try {
        if (!isOwners) return await reply(ownerMg);

        await ymd_db.removeKey(dbData.tableName, dbData.key);
        await reply(dbReset);
        await m.react('✅');

        const { exec } = require("child_process");
        const botName = require("../package.json").name;

        exec(`pm2 restart ${botName}`, (error, stdout, stderr) => {
            if (error) {
                console.error("❌ Exec error:", error);
                return reply(`❌ Restart failed: ${error.message}`);
            }
            if (stderr) console.warn("⚠️ Exec stderr:", stderr);
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg || "❌ Something went wrong!");
    }
});

cmd({
    pattern: "resetmvdb",
    react: "🗃️",
    desc: "Reset movie database",
    category: "owner",
    use: "resetmvdb",
    filename: __filename
},
async (conn, mek, m, { reply, isOwners, from }) => {
    try {
        if (!isOwners) return await reply(ownerMg);

        await resetMovie(dbReset);
        await m.react('✅');

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMg || "❌ Something went wrong!");
    }
});

cmd({
    pattern: "device",
    react: "ℹ️",
    alias: ["getdevice"],
    desc: "Check Use WhatsApp",
    category: "owner",
    use: 'device',
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwners }) => {
    try {
        if (!isOwners) return await reply(ownerMg);
        if (!m.quoted?.id) return reply(replyMg);

        let user = m.quoted.sender?.split('@')[0] || "Unknown";
        let device = "Android WhatsApp";  // Default assumption
        
        const deviceMapping = {
            "3A": "iOS WhatsApp (iPhone)",
            "3EB": "Web WhatsApp",
            "BAE": "Web WhatsApp (Baileys/Wiskeysockets API)",
            "QUEENAMDI": "Web WhatsApp (QueenAmdi-Wa-Bot)",
            "TAIFUR2": "Web WhatsApp (Taifur-X-Wa-Bot)",
            "ZEROTWO": "Web WhatsApp (ZeroTwo-Md-Wa-Bot)",
            "MOVIEX": "Web WhatsApp (Movie-X-Wa-Bot)",
            "YASIYA": "Web WhatsApp (Yasiya-Md-Wa-Bot)"
        };

        for (const prefix in deviceMapping) {
            if (m.quoted.id.startsWith(prefix)) {
                device = deviceMapping[prefix];
                break;
            }
        }

        conn.sendMessage(from, { 
            text: `@${user}  *Is Using:* \`\`\`${device}\`\`\``, 
            mentions: [`${user}@s.whatsapp.net`]
        });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        await reply(errorMg);
    }
});


cmd({
    pattern: "id",
    react: "⚜",
    alias: ["getdeviceid"],
    desc: "Get message id",
    category: "owner",
    use: 'id',
    filename: __filename
},
async(conn, mek, m,{ from, reply, isOwners }) => {
try{
if (!isOwners) return await reply(ownerMg)
    
if (!m.quoted) return reply('*Please reply a Message... ℹ️*')
await reply(m?.quoted?.id)

} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg)
}
})


cmd({
  pattern: "vv",
  react: "👁️",
  alias: ["getvv", 'viewonce'],
  desc: "View once media extractor",
  category: "owner",
  use: 'vv <reply to view once>',
  filename: __filename
}, async (conn, mek, m, { from, l, isDev, msg, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
  
    if (!m.quoted) {
        return await reply(await tr('Reply to a View Once Photo / Video or Audio to upload it as normal media type..❗.', lang));
    }
     try {
        let messageType = m.quoted.msg.message.imageMessage? 'imageMessage' : m.quoted.msg.message.videoMessage? 'videoMessage': m.quoted.msg.message.audioMessage? 'audioMessage' : '';
 
        let mime = m.quoted[messageType]?.mimetype || m.quoted.msg.message[messageType]?.mimetype || '';
 
        let isViewOnce = m.quoted[messageType]?.viewOnce || m.quoted.isViewOnce  ||  m.quoted.msg.message[messageType]?.viewOnce || m.quoted.isViewOnceMessageV2  || (m.quoted.contextInfo?.isViewOnce === true);

        if (!isViewOnce || (!mime.includes('image') && !mime.includes('audio') && !mime.includes('video'))) {
            return await reply(await tr('❌ This is not a "View Once" media. Reply to a View Once Image / Video or Audio.', lang));
        }

        let caption = m.quoted[messageType].caption|| 'No caption available';
        let media = await m.quoted.download();
        if (!media) {
            return await reply(await tr('❌ Failed to download the media.', lang));
        }

        let formattedCaption = `*🍁 Media Caption:*\n ${caption}\n\n${config.CAP}`;

        let messageOptions = { quoted: m };
        if (mime.includes('image')) {
            return conn.sendMessage(from, { image: media, caption: formattedCaption }, messageOptions);
        } else if (mime.includes('video')) {
            return conn.sendMessage(from, { video: media, caption: formattedCaption }, messageOptions);
        } else if (mime.includes('audio')) {
            return conn.sendMessage(from, { audio: media}, messageOptions);
       }

    } catch (error) {
        console.error(error);
        return await reply(await tr('❌ Error processing the View Once media.', lang));
    }
});


cmd({
    pattern: "setautoreply",
    react: "💾",
    alias: ["setreply", "addreply"],
    desc: "Set an auto-reply trigger and its response.",
    category: "owner",
    use: 'setautoreply <trigger>➕<response>',
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix, q, senderNumber, isOwners, client }) => {
  
    if (!isOwners) return reply(ownerMg);

    try {
        let [trigger, response] = q.split("➕");

        if (!trigger || !response) {
            return reply("⚠ *Usage:* `setautoreply <trigger>➕<response>`");
        }

        trigger = trigger.trim().toUpperCase();
        response = response.trim();

        await saveAutoReply(client, trigger, response);
        await reply(`✅ *Auto-reply saved!*\n\n📌 *Trigger:* ${trigger}\n💬 *Response:* ${response}`);
        await m.react("💾");
    } catch (error) {
        console.error(error);
        await reply(errorMg);
    }
});

cmd({
    pattern: "delautoreply",
    react: "🚮",
    alias: ["delreply", "delreply"],
    desc: "Delete a specific auto-reply by its trigger.",
    category: "owner",
    use: 'delautoreply <trigger>',
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix, q, senderNumber, isOwners, client }) => {
  
    if (!isOwners) return reply(ownerMg);

    try {
        if (!q) {
            return reply("⚠ *Usage:* `delautoreply <trigger>`");
        }

        var trigger = q.trim().toUpperCase();
        const autoReply = await deleteAutoReply(client, trigger);
        
        if (autoReply) {
            await reply(`✅ *Auto-reply Deleted!*\n\n📌 *Trigger:* ${trigger}`);
            await m.react("✅");
        } else {
            await reply(`❌ *No auto-reply found for trigger:* ${trigger}`);
            await m.react("❌");
        }
    } catch (error) {
        console.error(error);
        await reply(errorMg);
    }
});



cmd({
    pattern: "delallautoreply",
    react: "🗑",
    alias: ["delallreply", "delallreply"],
    desc: "Delete all auto-replies.",
    category: "owner",
    use: 'delallautoreply',
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix, q, senderNumber, isOwners, client }) => {
  
    if (!isOwners) return reply(ownerMg);

    try {
        await deleteAllAutoReplies(client);
        await reply("✅ All auto-replies deleted!");
        await m.react("🗑");
    } catch (error) {
        console.error(error);
        await reply(errorMg);
    }
});


cmd({
    pattern: "getallreplies",
    react: "📜",
    alias: ["listautoreplies", "showautoreplies"],
    desc: "Get all stored auto-replies.",
    category: "owner",
    use: 'getallreplies',
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix, q, senderNumber, isOwners, client }) => {

    if (!isOwners) return reply(ownerMg);

    try {
        const autoReplies = await getAllReplies(client);

        if (autoReplies && autoReplies.length > 0) {
            let msg = '📜 *List of All Auto-Replies:*\n\n';
            
            autoReplies.forEach(replyObj => {
                msg += `📌 *Trigger:* ${replyObj.trigger}\n💬 *Response:* ${replyObj.response}\n\n`;
            });

            await reply(msg);
            await m.react("📜");
        } else {
            await reply("❌ No auto-replies found.");
            await m.react("❌");
        }
    } catch (error) {
        console.error(error);
        await reply(errorMg);
    }
});



cmd({
  pattern: "getpp",
  alias: ["getdp", "pic"],
  desc: "Extract profile pic of mentioned user or number",
  category: "owner",
  use: "ppurl @user / .ppurl 9476XXXXXXX",
  react: "🖼️",
  filename: __filename
}, async (conn, mek, m, { reply, args, from, isOwners }) => {
  try {

    if (!isOwners) return await reply(ownerMg);
    let targetJid;

    if (m.mentionedJid && m.mentionedJid.length > 0) {
      targetJid = m.mentionedJid[0];
    } else if (args[0]) {
      const raw = args[0].replace(/[^0-9]/g, "");
      if (raw.length < 8) return await reply(pfInvalid);
      targetJid = raw + "@s.whatsapp.net";
    } else if (mek.quoted?.sender) {
      targetJid = mek.quoted.sender;
    } else {
      return await reply(pfMention);
    }

    const url = await conn.profilePictureUrl(targetJid, "image").catch(() => null);

    if (!url) return await reply(pfNotfound);

    const sent = await conn.sendMessage(from, {
      image: { url },
      caption: `🖼️ *Profile picture of:* \`${targetJid.split("@")[0]}\`\n\n${config.FOOTER}`
    }, { quoted: mek });

    await conn.sendMessage(from, {
      react: {
        text: "🖼️",
        key: sent.key
      }
    });

  } catch (err) {
    console.log("PPURL Error:", err);
    await reply(pfError);
  }
});


cmd({
    pattern: "privacysettings",
    alias: ["privacy", "myprivacy"],
    react: "🔐",
    desc: "Shows bot's current WhatsApp privacy settings",
    category: "owner",
    use: "privacysettings",
    filename: __filename
},
async (conn, mek, m, { from, isOwners, reply, botNumber2 }) => {
        try {

            if (!isOwners) return await reply(ownerMg);
            const {
                readreceipts,
                profile,
                status,
                online,
                last,
                groupadd,
                calladd
            } = await conn.fetchPrivacySettings(true);

            const privacyText = `*🔐 Current Privacy Settings*

*👤 Name*       : ${conn.user.name}
*🟢 Online*     : ${online}
*🖼️ Profile Pic*: ${profile}
*👁️ Last Seen*  : ${last}
*✅ Read Receipts* : ${readreceipts}
*👥 Group Add*  : ${groupadd}
*📄 Status*     : ${status}
*📞 Call Add*   : ${calladd}
`;

            const avatar = await conn.profilePictureUrl(botNumber2, 'image')
                .catch(() => 'https://telegra.ph/file/b34645ca1e3a34f1b3978.jpg');

            await conn.sendMessage(from, {
                image: { url: avatar },
                caption: privacyText
            }, { quoted: mek });

        } catch (e) {
        console.error(e);
        await reply(errorMg);
        }
    });


cmd({
    pattern: "block",
    alias: ['bye'],
    react: "🚫",
    desc: "Block a user",
    category: "owner",
    use: "block <@tag | number | reply>",
    filename: __filename
},
async (conn, mek, m, { args, isOwners, reply, isGroup, from }) => {
    if (!isOwners) return await reply(ownerMg);
    
    let userToBlock;

    if(!isGroup){
        userToBlock = from
    } else if (m.quoted) {
        userToBlock = m.quoted.sender;
    } else if (args[0]) {
        userToBlock = args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    } else {
        return await reply("⚠️ Tag, reply or provide a number to block.");
    }

    try {
        await conn.updateBlockStatus(userToBlock, "block");
        await reply(`✅ Blocked: @${userToBlock.split("@")[0]}`, { mentions: [userToBlock] });
    } catch (e) {
        console.error(e);
        await reply(errorMg);
    }
});


cmd({
    pattern: "unblock",
    alias: ['unblocks'],
    react: "🛑",
    desc: "Unblock a user",
    category: "owner",
    use: "unblock <@tag | number | reply>",
    filename: __filename
},
async (conn, mek, m, { args, isOwners, reply, isGroup, from }) => {
    if (!isOwners) return await reply(ownerMg);

    let userToUnblock;

    if(!isGroup){
        userToUnblock = from
    } else if (m.quoted) {
        userToUnblock = m.quoted.sender;
    } else if (args[0]) {
        userToUnblock = args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    } else {
        return await reply("⚠️ Tag, reply or provide a number to unblock.");
    }

    try {
        await conn.updateBlockStatus(userToUnblock, "unblock");
        await reply(`✅ Unblocked: @${userToUnblock.split("@")[0]}`, { mentions: [userToUnblock] });
    } catch (e) {
        console.error(e);
        await reply(errorMg);
    }
});

cmd({
    pattern: "rename",
    react: "⏭️",
    alias: ["r", "chang", "ussamu", "tarahawennaepa"],
    desc: "Change file name and caption",
    category: "other",
    use: "rename file_name + caption",
    filename: __filename
},
async (conn, mek, m, { from, q, isDev, isOwners, isMe, reply, l }) => {
    try {
        if (!isOwners) return await reply("❌ *Only bot owners can use this command!*");
        if (!m.quoted) return await reply("❌ *Please reply to a document file!*");

        // Extract file name and caption
        let [fileName, cap] = q.split('+').map(s => s.trim());
        let caption = cap || fileName; 

        let message = mek;
        message.key = {
            remoteJid: from,
            fromMe: true,
            id: m.quoted?.key?.id,
            participant: conn.user.jid
        };

        // Modify quoted message
        if (m.quoted.documentWithCaptionMessage) {
            m.quoted.documentWithCaptionMessage.message.documentMessage.fileName = config.FILE_NAME + `${fileName || m.quoted.documentWithCaptionMessage.message.documentMessage.fileName}`;
            m.quoted.documentWithCaptionMessage.message.documentMessage.caption = caption || m.quoted.documentWithCaptionMessage.message.documentMessage.caption;
        } else if (m.quoted?.documentMessage) {
            m.quoted.documentMessage.fileName = config.FILE_NAME + `${fileName || m.quoted.documentMessage?.fileName}`;
            m.quoted.documentMessage.caption = caption || m.quoted.documentMessage?.caption;
        } else {
            return await reply("❌ *This is not a document file!*");
        }

        message.message = m.quoted;
        
        // Forward the modified message
        await conn.forwardMessage(from, message, false);

        // React with success emoji
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

    } catch (e) {
        l(e);
        await reply("*An error occurred. Please try again later. ⛔️*");
        await conn.sendMessage(from, { react: { text: '⛔️', key: mek.key }});
    }
});

cmd({
    pattern: "forward",
    react: "⏭️",
    alias: ["f", "share", "sendfile"],
    desc: "Forward quoted media/message to given JID(s)",
    category: "owner",
    use: 'forward <jid or jid1,jid2,...>',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, q, isMe, isOwners, reply, botNumber2 }) => {
try {
  if (!isOwners)
    return await reply("*Only owner can use this command.* ❌");

  if (!m.quoted) return await reply("*Please reply to a file or message to forward.* ❓");

  let sendList = [];
  let message = {};
        message.key = {
            remoteJid: from,
            fromMe: true,
            id: mek?.quoted?.fakeObj.key,
            participant: conn.user.lid.split(":")[0] + "@lid" || botNummber2
        };

   message.message = mek.quoted;

  if (!q || !q.includes("@")) {
    // Self forward

    if(m.quoted.type === "imageMessage"){
       await conn.sendMessage(from, { image: await m.quoted.download(m.key.id), caption: m.quoted.imageMessage.caption || "" });
    } else {
    await conn.forwardMessage(from, message, false);
    }
    sendList.push(from);
  } else if (q.includes(",")) {
    // Multiple JIDs
    const split = q.split(",");
    for (let j of split) {
    if(m.quoted.type === "imageMessage"){
       await conn.sendMessage(j, { image: await m.quoted.download(m.key.id), caption: m.quoted.imageMessage.caption || "" });
    } else {
      await conn.forwardMessage(j.trim(), message, false);
    }
      sendList.push(j.trim());
    }
  } else {
    // Single JID
    if(m.quoted.type === "imageMessage"){
       await conn.sendMessage(q, { image: await m.quoted.download(m.key.id), caption: m.quoted.imageMessage.caption || "" });
    } else {
    await conn.forwardMessage(q, message, false);
    }
    sendList.push(q);
  }

 
  await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });
  reply(`*✅ File sent to:*\n${sendList.map(x => `• ${x}`).join('\n')}`);

} catch (e) {
  await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
  await reply("*An error occurred. Try again later.*");
  console.error(e);
}
});


cmd({
    pattern: "update",
    react: "🔁",
    desc: "To Update Bot",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwners, userName, repoName }) => {
    try {
        if (!isOwners) return await reply(ownerMg);

        const data = await fetchJson(`https://raw.githubusercontent.com/${userName}/${repoName}/refs/heads/main/BOT-DATA/data.json`);
        if(dbData.VERSION === data?.releaseVersion){
            reply(latestHave);
            return
        }

       const msg = await conn.sendMessage(from, { text: '🧹 Cleaning old files...' }, { quoted: mek });

        // Helper to remove folders or files from root
        const rootPath = path.resolve(__dirname, ".."); // go one level up from plugins/
        
        const removeDir = async (relative, label) => {
            const fullPath = path.join(rootPath, relative);
            if (fs.existsSync(fullPath)) {
                fs.rmSync(fullPath, { recursive: true, force: true });
                await conn.sendMessage(from, { text: `✅ ${label} removed.`, edit: msg.key });
            } else {
                await conn.sendMessage(from, { text: `⚠️ ${label} not found.`, edit: msg.key });
            }
        };

        const removeFile = async (relative, label) => {
            const fullPath = path.join(rootPath, relative);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                await conn.sendMessage(from, { text: `✅ ${label} removed.`, edit: msg.key });
            } else {
                await conn.sendMessage(from, { text: `⚠️ ${label} not found.`, edit: msg.key });
            }
        };

        // Remove folders and file
        await removeDir("lib", "Lib folder");
        await removeDir("plugins", "Plugins folder");
        await removeFile("index.js", "index.js file");

        // 🔄 Restart
        await conn.sendMessage(from, { text: restartMg, edit: msg.key });
        exec(`pm2 restart ${require("../package.json").name}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                return reply(errorMg);
            }
           reply(rsMg);
        });

    } catch (error) {
        console.error("❌ Update failed:", error);
        await conn.sendMessage(from, { text: '❌ Update Failed! Check Logs.' }, { quoted: mek });
    }
});


cmd({
    pattern: "movie_setup",
    react: "🧩",
    alias: ["movieset", "moviealive", "exmovie"],
    desc: "Show Movie details variable keys.",
    category: "owner",
    use: "movie_setup",
    filename: __filename
},
async (conn, mek, m, { from, prefix, pushname, reply, isOwners }) => {
    try {
        if (!isOwners) return await reply(ownerMg);

        const keysList = [
            '`${movieTitle}` - Movie title',
            '`${movieReleasedate}` - Release date',
            '`${movieCountry}` - Country',
            '`${movieRuntime}` - Runtime',
            '`${movieCategories}` - Categories',
            '`${movieImdbRate}` - IMDb rating',
            '`${movieDirector}` - Director',
            '`${movieCast}` - Main cast'
        ];

        const msgText = `🛠️ *Movie Details Keys Guide*\n\n` +
            `You can use the following variables in your *MOVIE_DETIALS_CARD*:\n\n` +
            keysList.map(k => "🔹 " + k).join("\n") +
            `\n\n\n💡 *Example:* \n` +
              "🍿 Title: *`${movieTitle}`*\n" +
              "🎬 Released: `${movieReleasedate}`\n" +
              "🌍 Country: `${movieCountry}`\n" +
              "⏱ Duration: `${movieRuntime}`\n" +
              "🎭 Genre: `${movieCategories}`\n" +
              "⭐ IMDb Rating: `${movieImdbRate}`\n" +
              "🎬 Directed By: `${movieDirector}`\n" +
              "👥 Cast: `${movieCast}`\n\n" +
              `📌 After setting the message, use *${prefix}apply* to apply changes.\n`;

        const sentMsg = await conn.sendMessage(from, {
            text: msgText,
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply(errorMg);
    }
});

cmd({
    pattern: "episode_setup",
    react: "🧩",
    alias: ["episodeset", "epset", "ep_setup"],
    desc: "Show Episode details variable keys.",
    category: "owner",
    use: "episode_setup",
    filename: __filename
},
async (conn, mek, m, { from, prefix, pushname, reply, isOwners }) => {
    try {
        if (!isOwners) return await reply(ownerMg);

        const keysList = [
            '`${epTitle}` -  Episode Title',
            '`${epOriginalTitle}` - Episode Original Title',
            '`${epReleasedate}` - Episode Release Date',
            '`${epUrl}` - Episode Url'
        ];

        const msgText = `🛠️ *Episode Details Keys Guide*\n\n` +
          `You can use the following variables in your *EPISODE_DETAILS_CARD*:\n\n` +
          keysList.map(k => "🔹 " + k).join("\n") +
          `\n\n\n💡 *Example:*\n\n` +
          `🍿 *\${epOriginalTitle}*\n\n` +
          `🎬 Episode Title: \${epTitle}\n` +
          `📅 Release Date: \${epReleasedate}\n` +
          `🔗 Watch Now: \${epUrl}\n\n` +
          `📌 After setting the message, use *${prefix}apply* to apply changes.\n`;


        const sentMsg = await conn.sendMessage(from, {
            text: msgText,
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await reply(errorMg);
    }
});


// ============================================= BODY ============================================= //
cmd({
    on: "body"
}, async (conn, mek, m, { from, isOwners, client }) => {
    try {
       
        if (mek.key && config.AUTO_REPLY === "true" && !isOwners) {
            await handleAutoReply(client, conn, mek);
        }
    } catch (e) {
        console.log("Error in auto reply handler:", e);
    }
});
