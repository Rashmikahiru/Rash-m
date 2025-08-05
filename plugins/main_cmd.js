const config = require('../config');
const os = require('os');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, getDateAndTime, tr } = require('../lib/functions');
const si = require('systeminformation');
const emojiRegex = require('emoji-regex');
const { storenumrepdata } = require('../lib/numreply-db');
const { buttonDesc, buttonTitle } = require('../lib/config');
const DBM = require("../lib/database");
const dbData = require("../lib/config");
const ymd_db = new DBM();
// ============================= L A N G U A G E =============================
var errorMg, ownerMg, needCmd, needNumber, pairCodeMis, pairExpireAlert, pairExpireMg;


    errorMg = '*An error occurred, please try again later ❌*'; 
    ownerMg = '🚫 *You are not authorized to use this command!*';
    invalidReply = '❌ Invalid choice! Reply with ';
    needCmd = "*Please provide a command ❓*";
    needNumber = "*📞 Please enter a number!*";
    pairCodeMis = "*❌ Error retrieving the pair code!*";
    pairExpireAlert = "This code will expire in 1.5 minutes.";
    pairExpireMg = "The pair code is now expired.";
    


let lang = "en";
if(config.LANG === "SI"){
   lang = "si" 
} else if(config.LANG === "TA"){
    lang = "ta" 
} else if(config.LANG === "HI"){
    lang = "hi" 
}

const botName = '𝚁𝙰𝚂𝙷-𝙼𝙳'
// ============================= C M D =============================
cmd({
    pattern: "alive",
    alias: ["bot", "online"],
    react: "⚡",
    desc: "Check if the bot is online and running",
    category: "main",
    filename: __filename
  }, async (conn, mek, m, { from, pushname, reply, senderNumber, prefix, isGroup, q }) => {  // Add 'reply' to the destructured object
    try {
        
      const hostname = os.hostname().length === 12 ? 'replit' :
                       os.hostname().length === 36 ? 'heroku' :
                       os.hostname().length === 8  ? 'koyeb' :
                       os.hostname();
  
      const dateAndTime = await getDateAndTime(config.TIME_ZONE || "Asia/Colombo");
      const hour = new Date().getHours();  // Get current hour to determine greeting
      let greeting = "Good night";
      if (hour >= 5 && hour < 12) greeting = "Good morning";
      else if (hour >= 12 && hour < 17) greeting = "Good afternoon";
      else if (hour >= 17 && hour < 21) greeting = "Good evening";
  
      
      const runtimes = (s) => {
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
        return `${h}h ${m}m ${sec}s`;
      };


        
      const memUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB`;
      const date = dateAndTime.date || '';
      const time = dateAndTime.time || '';
      const runtime = runtimes(process.uptime());
      const user = isGroup ? "@" + senderNumber : pushname;
      const version = dbData.VERSION || require("../package.json").version;
      const ownerNumber = config.OWNER_NUMBER;
      const ownerName = config.OWNER_NAME;
  
      let aliveText = `*🌹 Hey ${user}, I'm alive now!*\n
  ╭━━═[ ⚡ *BOT STATUS* ]═━━╮
  │
  │ 🤖 *Bot:* Online & Smooth
  │ 📅 *Date:* ${date}
  │ ⏰ *Time:* ${time}
  │ 🆙 *Uptime:* ${runtime}
  │ 💾 *Memory:* ${memUsage}
  │ ⚙️ *Platform:* ${hostname}
  │ 🧬 *Version:* ${version}
  │
  ╰═━═━═━═━═━═━═━═━╯
 `;
  
  if(config.MESSAGE_TYPE.toLowerCase() === "button"){
           
        const buttons = [
             { buttonId: `${prefix}menu`, buttonText: { displayText: 'COMMAND LIST 📑' }, type: 1 },
             { buttonId: `${prefix}ping`, buttonText: { displayText: 'BOT SPEED ⚡' }, type: 1 },
             { buttonId: `${prefix}system`, buttonText: { displayText: 'SYSTEM INFORMATION 🖲️' }, type: 1 }
             ]

         await conn.sendMessage(from, {
          image: { url: config.ALIVE_LOGO || config.LOGO },
          caption: aliveText,
          footer: config.FOOTER,
          contextInfo: {
                externalAdReply: {
                     title: `👋 Hellow ${pushname}`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: ''
          }},
          buttons,
          headerType: 1,
          viewOnce: true
        }, { quoted: mek });

           } else {
           
           aliveText += `\n\n1  COMMAND LIST 📑\n` +
           `2  BOT SPEED ⚡\n` + 
           `3  SYSTEM INFORMATION 🖲️\n\n` +
           config.FOOTER

        const numrep = [];
        numrep.push(`${prefix}menu`);
        numrep.push(`${prefix}ping`);
        numrep.push(`${prefix}system`);
      
      const sentMsg = await conn.sendMessage(from, {
        image: { url: config.ALIVE_LOGO || config.LOGO },
        caption: aliveText,
        contextInfo: {
                externalAdReply: {
                     title: `👋 Hellow ${pushname}`,
                     body: config.BODY || "",
                     thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                     mediaType: 1,
                     sourceUrl: q
          }},
        mentions: [mek.sender],
      }, { quoted: mek });
      
      const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '💀', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'nondecimal'
                          }
                        await storenumrepdata(jsonmsg) 
      }
  
    } catch (err) {
      console.error(err);
      await conn.sendMessage(from, { text: 'An error occurred, please try again later ❌' },{ quoted: mek });
    }
  });


cmd({
        pattern: "repo",
        react: "🍬",
        alias: ["sc", "script", "bot_sc"],
        desc: "Check bot repo.",
        category: "main",
        use: 'repo',
        filename: __filename
    },
    async (conn, mek, m, { from, prefix, pushname, reply }) => {
        try {

            const mesg = `Non Publish`;
            
            const sentMsg = await conn.sendMessage(from, { text: mesg ,
                        contextInfo: {
                               externalAdReply: {
                                    title: "🃏 RUSH-MD REPO 🃏",
                                    body: config.FOOTER,
                                    thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                    mediaType: 1,
                                    sourceUrl: ''
                                 }}}, { quoted: mek });
            
            await conn.sendMessage(from, { react: { text: '🧩', key: sentMsg.key } });
            
        } catch (e) {
            await reply(errorMg)
            console.log(e)
        }
    })


cmd({
        pattern: "ping",
        react: "📟",
        alias: ["speed"],
        desc: "Check bot\'s ping",
        category: "main",
        use: 'ping',
        filename: __filename
    },
    async (conn, mek, m, {
        from,
        reply
    }) => {
        try {
            let inital = new Date().getTime();
            let ping = await conn.sendMessage(from, {
                text: '```Cheking Bot Speed ❗```'
            }, {
                quoted: mek
            })
            let final = new Date().getTime();
            return await conn.edit(ping, '*📍 Pong ' + (final - inital) + 'ms* ')
        } catch (e) {
            await reply(errorMg)
            console.log(e)
        }
    })


    cmd({ 
        pattern: "system",
        react: "🖥️",
        alias: ["s_info"],
        desc: "To Check bot's System information",
        category: "main",
        use: 'system',
        filename: __filename
    },
    async (conn, mek, m, { from, reply }) => {
        try {
            const ccp = await si.cpu();
            const cinfo = await si.version();
            const plat = os.hostname();
            const dateAndTime = await getDateAndTime(config.TIME_ZONE || "Asia/Colombo");
            const date = dateAndTime.date || '';
            const time = dateAndTime.time || '';
            
            const infomsg = `
╭━━━━━━━━━━━━━━━━⬣
*🖥️ ${botName} SYSTEM INFO 🖥️*
╰━━━━━━━━━━━━━━━━⬣
    
🌍 *${await tr("Platform", lang)}*      : ${plat}
⏳ *${await tr("Uptime", lang)}*       : ${runtime(process.uptime())}
💾 *${await tr("RAM Usage", lang)}*    : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem() / 1024 / 1024)}MB
🧬 *${await tr("Bot Version", lang)}*  : ${dbData.VERSION}
🚀 *${await tr("CPU Speed", lang)}*    : ${ccp.speed} GHz
🔧 *${await tr("Engine Version", lang)}* : ${cinfo}
📆 *${await tr("Date", lang)}*           : 📅 ${date}
⏰ *${await tr("Time", lang)}*           : ⏱️ ${time}
    
╭─────────────◆
*🔥 Bot Running Smoothly! 🚀*
╰─────────────◆`;
    
         
            await conn.sendMessage(from, {
                image: { url: config.LOGO },
                caption: infomsg
            }, { quoted: mek });
    
        } catch (e) {
            console.error("❌ Error fetching system info:", e);
            await reply(errorMg);
        }
    });


cmd({
    pattern: "menu",
    alias: ["panel", "cmds", "lits", "cmd"],
    react: "📑",
    desc: "Show all available commands in a categorized menu",
    category: "main",
    use: `menu`,
    filename: __filename
}, async (conn, mek, m, { from, reply, prefix }) => {
    try {
        const menuSections = [
            { id: "1️⃣", name: "Download Commands 📦", category: "download", logo: "" },
            { id: "2️⃣", name: "Owner Commands 👨‍🔧", category: "owner", logo: "" },
            { id: "3️⃣", name: "Group Commands 🎀", category: "group", logo: "" },
            { id: "4️⃣", name: "News Commands 📰", category: "news", logo: "" },
            { id: "5️⃣", name: "Main Commands 📂", category: "main", logo: "" },
            { id: "6️⃣", name: "AI Commands 🧠", category: "ai", logo: "" }
        ];

        const dateAndTime = await getDateAndTime(config.TIME_ZONE || "Asia/Colombo");
        const date = dateAndTime.date || '';
        const time = dateAndTime.time || '';

        let menuText = `╔❖🔹 *ＲＡＳＨ-ＭＤ ＭＡＩＮ ＭＥＮＵ* 🔹❖╗\n`;
        menuText += `║ 🤵 *${await tr("Owner", lang)}:* ${config.OWNER_NAME}\n`;
        menuText += `║ 📞 *${await tr("Owner Number", lang)}:* ${config.OWNER_NUMBER}\n`;
        menuText += `║ 🚀 *Prefix:* ${config.PREFIX}\n`;
        menuText += `║ 🕒 *${await tr("Time", lang)}:* ${time}\n`;
        menuText += `║ 📅 *${await tr("Date", lang)}:* ${date}\n`;
        menuText += `║ 📋 *${await tr("Categories", lang)}:* ${menuSections.length}\n`;
        menuText += `╚══════════════════╝\n\n`;

        if (config.MESSAGE_TYPE.toLowerCase() === "button") {
            const rows = menuSections.map(section => ({
                title: section.name,
                description: buttonDesc,
                id: `${prefix}menu_list ${section.category} ${section.logo || config.LOGO}=${section.name}`
            }));

            const listData = {
                title: buttonTitle,
                sections: [
                    {
                        title: "Select category",
                        rows
                    }
                ]
            };

            await conn.sendMessage(from, {
                image: { url: config.LOGO },
                caption: menuText,
                footer: `💡 *Use* _${config.PREFIX}help <command>_ *for details!*\n\n` + config.FOOTER,
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
            menuSections.forEach(section => {
                menuText += `${section.id}️ *${section.name}*\n`;
            });

            menuText += `\n💡 *Use* _${config.PREFIX}help <command>_ *for details!*\n\n`;
            menuText += `${config.FOOTER}`;

            const numrep = menuSections.map(section => (
                `${prefix}menu_list ${section.category} ${section.logo || config.LOGO}=${section.name}`
            ));

            const sentMsg = await conn.sendMessage(from, {
                image: { url: config.LOGO },
                caption: menuText
            }, { quoted: mek });

            await conn.sendMessage(from, {
                react: { text: '🔢', key: sentMsg.key }
            });

        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '💀', key: messageKey } });
        const jsonmsg = {
                          key : messageKey,
                          numrep,
                          method : 'nondecimal'
                          }
                        await storenumrepdata(jsonmsg) 
        }

    } catch (e) {
        console.error(e);
        await reply(errorMg);
    }
});

cmd({
    pattern: "menu_list",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, quoted, q, prefix, reply }) => {
    try {
        let cat = q?.split(" ")[0];
        let logo = q?.split(" ")[1].split("=")[0] || config.LOGO;
        let name = q?.includes("=") ? q.split("=")[1] : cat;

        function extractEmojis(text) {
            const regex = emojiRegex();
            return [...text.matchAll(regex)].map(match => match[0]);
        }

        const emojisOnly = extractEmojis(name || "");
        const emoji = emojisOnly[0] || "📄";

        await conn.sendMessage(from, {
            react: { text: emoji, key: mek.key }
        });

        const generateMenu = (category) => {
            let menu = "";
            let length = 0;
            for (let cmd of commands) {
                if (cmd.category === category && !cmd.dontAddCommandList) {
                    menu += `┆ 🔹 Pattern: ${cmd.pattern}\n┆ 📖 Desc: ${cmd.desc}\n┆\n`;
                    length++;
                }
            }
            return { menu: menu || "❌ No commands found for this category!", length };
        };

        const menuText = generateMenu(cat);
        let responseMsg = `┏━━━❰ *${name.toUpperCase()}* ❱━━━┓\n`;
        responseMsg += `┃ 📚 Category : ${cat}\n`;
        responseMsg += `┃ 🔢 Total Commands : ${menuText.length}\n`;
        responseMsg += `┗━━━━━━━━━━━━━━━━━━━━┛\n\n`;

        if (menuText.length > 0) {
            responseMsg += `┌───⌬ *Available Commands* ⌬───┐\n`;
            responseMsg += menuText.menu;
            responseMsg += `└──────────────────────┘\n`;
        } else {
            responseMsg += `⚠️ No commands found under *${cat}* category!\n`;
        }

        responseMsg += `\n${config.FOOTER}`;


        await conn.sendMessage(from, {
            image: { url: logo },
            caption: responseMsg
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(errorMg);
    }
});


cmd({
    pattern: "help",
    alias: ["menu"],
    desc: "Show this help menu",
    category: "menu",
    use: "help or .help <command>",
    filename: __filename,
}, 
async (conn, mek, m, { reply, q, prefix }) => {
    try {
        
        if (!q) return reply(needCmd);
        
            let name = q.toLowerCase();
            let command = commands.find(cmd =>
                cmd.pattern === name || (cmd.alias && cmd.alias.includes(name))
            );

            if (!command) return reply("❌ Command not found.");

            let helpText = `📌 *${await tr("Command", lang)}:* ${prefix}${command.pattern}\n`;
            helpText += `📃 *${await tr("Description", lang)}:* ${await tr(command.desc || 'No description', lang)}\n`;
            helpText += `📂 *${await tr("Category", lang)}:* ${command.category}\n`;
            helpText += `🛠️ *${await tr("Usage", lang)}:* ${prefix}${command.use || 'Not specified'}\n`;
            helpText += `📁 *${await tr("File", lang)}:* ${command.filename}`;

            return reply(helpText);
        
    } catch (e) {
        console.error(e);
        reply(errorMg);
    }
});



cmd({
    pattern: "owner",
    react: "🤵",
    alias: ["creator"],
    desc: "Get the bot owner's contact details.",
    category: "main",
    use: "owner",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const contact = {
            displayName: "RUSH MD",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${config.OWNER_NAME || "Dark Yasiya"}\nTEL;waid=${config.OWNER_NUMBER || "94743548986"}:+${config.OWNER_NUMBER || "94743548986"}\nEND:VCARD`
        };

        return await conn.sendMessage(from, {
            contacts: { displayName: contact.displayName, contacts: [contact] }
        }, { quoted: mek });

} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
await reply(errorMg)
}
})

