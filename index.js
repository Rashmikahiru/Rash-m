const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    getContentType,
    Browsers,
    getAggregateVotesInPollMessage,
    makeCacheableSignalKeyStore,
    receivedPendingNotifications,
    generateWAMessageFromContent,
    generateForwardMessageContent,
    getDevice,
    prepareWAMessageMedia,
    proto,
    downloadContentFromMessage,
    jidDecode,
    makeInMemoryStore
    } = require('@whiskeysockets/baileys')
    
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const NodeCache = require('node-cache');
const util = require('util');
const axios = require('axios');
const { File } = require('megajs');
const path = require('path');
const chalk = require("chalk");
const { MongoClient } = require('mongodb');
const { Pool } = require('pg');

const msgRetryCounterCache = new NodeCache();
const l = console.log;
const sessionFolder = path.join(__dirname, 'auth_info_baileys');
const sessionFile = path.join(sessionFolder, 'creds.json');

function base64Decode(encoded) {
  try {
    const buffer = Buffer.from(encoded, 'base64');
    return buffer.toString('utf-8');
  } catch (error) {
    return '❌ Error decoding Base64: ' + error.message;
  }
}

//===================SESSION============================
  if (!fs.existsSync(sessionFile)) {
    if (config.SESSION_ID) {
      const id = config.SESSION_ID;

      // Base64 type
      if (id.startsWith("YASIYA-MD=")) {
        try {
          const sessdata = id.split("=")[1];
          const base64Decode = (str) => Buffer.from(str, "base64").toString("utf-8");
          const data = base64Decode(sessdata);

          if (data) {
            fs.mkdirSync(sessionFolder, { recursive: true });
            fs.writeFileSync(sessionFile, data);
            console.log("📡 Session      : 🔑 Retrieved from Base64");
          } else {
            throw new Error("Base64 decode failed or is empty");
          }
        } catch (e) {
          console.error("📡 Session      : ❌ Error decoding base64 session:", e.message);
        }

      // Mega type
      } else if (id.startsWith("YASIYA-MD~")) {
        try {
          const sessdata = id.split("~")[1];

          if (!sessdata.includes("#")) throw new Error("📡 Session      : Invalid MEGA session link format");

          const file = File.fromURL(`https://mega.nz/file/${sessdata}`);
          file.loadAttributes((err) => {
            if (err) throw err;

            file.downloadBuffer((err, data) => {
              if (err) throw err;

              fs.mkdirSync(sessionFolder, { recursive: true });
              fs.writeFileSync(sessionFile, data);
              console.log("📡 Session      : 🔑 Retrieved from MEGA");
            });
          });

        } catch (e) {
          console.error("❌ Error downloading session from MEGA:", e.message);
        }

      } else {
        console.log("📡 Session      : ❌ SESSION_ID Type Invalid");
      }

    } else {
      console.log("📡 Session      : ➡️  Please set your SESSION_ID in the configuration or environment.\n");
    }
  }



// ============================ FUNCTIONS ============================

let client;
async function connectMongo(MONGO_URI) {
        if (client && client.topology?.isConnected()) {
        return client;
        }

    client = new MongoClient(MONGO_URI);

    await client.connect();
    return client;
}



if (!fs.existsSync("./temp")) {
    fs.mkdirSync("./temp", { recursive: true });
}
// <<==========PORTS===========>>
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
//====================================
async function yasiyaMd(){
       async function connectToWA() {
 
    const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, fetchBuffer, getFile, getDateAndTime } = require('./lib/functions');
    const { pqs_connection_start, start_numrep_process, upload_to_pqs, get_data_from_pqs, storenumrepdata, getstorednumrep } = require(`./lib/numreply-db.js`)
    const { sms, downloadMediaMessage } = require('./lib/msg');
    let dbData = require("./lib/config");
    const DBM = require("./lib/database");
    const ymd_db = new DBM();
    dbData.VERSION = '1.0.0';
    dbData.REPO = '';
    dbData.SUPPORT_GROUP = '';
    dbData.OFFICIAL_CHANNEL = '';
    dbData.NEWSLETTER_JIDS = [];
    dbData.OFFICIAL_SITE = '';
   
    console.log(`🛰️ Baileys      : 🔌 Connecting to Latest Version...`)
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
    const { version } = await fetchLatestBaileysVersion();
    let messageCache = new Map();
    let messageStore = new Map();

         const conn = makeWASocket({
    logger: P({ level: "fatal" }).child({ level: "fatal" }),
    printQRInTerminal: true,
    browser: Browsers.macOS("Safari"),
    generateHighQualityLinkPreview: true,
    auth: state,
    defaultQueryTimeoutMs: undefined,
    msgRetryCounterCache
  })
    

    conn.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
    if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode;
        isConnected = false
        console.log("❌ Connection closed! Reason:", reason);
        
    } else if (connection === 'open') {


            dbData.tableName = 'rushmd_config';
            dbData.key = conn.user.id.split(':')[0];
        
            await connectMongo(config.DATABASE_URL);
        
            const dbConfig = await ymd_db.startDB(dbData?.tableName, dbData?.key, client);
            console.log('🔌 Plugins      : 📦 Installing...')
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('📦 Plugins      : ✅ Installed');


            await start_numrep_process();
            
            console.log('💬 WhatsApp     : 🤖 Connected');

            const dateAndTime = await getDateAndTime(config.TIME_ZONE || "Asia/Colombo");
            const date = dateAndTime.date || '';
            const time = dateAndTime.time || '';
            
            await conn.sendMessage('94741113491@s.whatsapp.com', {
                image: { url: '' }, // Replace with your bot logo
                text: `🎉 *𝗬𝗔𝗦𝗜𝗬𝗔 𝗠𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗* 🎉\n\n` +
                         `🟢 *Status:* Online ✅\n` +
                         `📅 *Date:* ${date}\n` +
                         `🕒 *Time:* ${time}\n\n` +
                         `🌍 *Official Site:* ''\n\n` +
                         `📢 *Official Channel:* ''\n\n` +
                         `🛂 *Support Group:* https://chat.whatsapp.com/\n\n` +
                         `💻 *GitHub Repo:* ''\n\n` +
                         `⚡ *Commands are ready to use!*\n` +
                         `📩 Type *${config.PREFIX}menu* to view available commands.\n\n` +
                         `👥 *Developer Team:* Type *${config.PREFIX}team* to view our team list. \n\n> ${config.FOOTER || ''}`
            });    
            
        }
    })

    conn.ev.on('creds.update', saveCreds)
         

conn.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
        const isReact = msg?.message?.reactionMessage ? true : false;
        if (!msg?.key?.remoteJid || !msg?.key?.id || !msg?.message) continue;

        if(!isReact){
        const jid = msg.key.remoteJid;
        const msgId = msg.key.id;

        if (!messageStore.has(jid)) {
            messageStore.set(jid, new Map());
        }

        messageStore.get(jid).set(msgId, msg); // Save the message
    }}
});

           
    conn.ev.on('messages.upsert', async (mek) => {
        try {
            mek = mek.messages[0]
            if (!mek.message) return
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message

          // Auto read & react status ✅
          if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === 'true') {
              try {
                  await conn.readMessages([mek.key]);

                  if(config.AUTO_REACT_STATUS == "true"){
                  const emojis = ['🧩', '🍉', '💜', '🌸', '🪴', '💊', '💫', '🍂', '🌟', '🎋', '😶‍🌫️', '🫀', '🧿', '👀', '🤖', '🚩', '🥰', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
                  await conn.sendMessage(mek.key.remoteJid, { react: { key: mek.key, text: emojis[Math.floor(Math.random() * emojis.length)] } }, { statusJidList: [mek.key.participant, conn.user.id] });
                  }
                  
              } catch (error) {
                  console.error("Error reading message:", error);
               }
            }
            
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            const m = sms(conn, mek)
            const type = getContentType(mek.message)
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const prefix = config.PREFIX || '.';
            const ownerNumber = config.OWNER_NUMBER || '94743548986';
            const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
            const quotedid = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo ? mek.message.extendedTextMessage.contextInfo.stanzaId || null : null;
            
            let body = '';
            if (type === 'conversation') {
            body = mek.message.conversation || '';
            } else if (type === 'extendedTextMessage') {
            const storedNumRep = await getstorednumrep(quotedid, from, mek.message.extendedTextMessage.text, conn, mek);
            body = storedNumRep || mek.message.extendedTextMessage.text || '';
            } else if (type === 'interactiveResponseMessage') {
            try {
            const paramsJson = mek.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson;
            body = paramsJson ? JSON.parse(paramsJson)?.id || '' : '';
            } catch (error) {
            body = '';
            }
            } else if (type === 'templateButtonReplyMessage') {
            body = mek.message.templateButtonReplyMessage?.selectedId || '';
            } else if (type === 'imageMessage' && mek.message.imageMessage?.caption) {
            body = mek.message.imageMessage.caption || '';
            } else if (type === 'videoMessage' && mek.message.videoMessage?.caption) {
            body = mek.message.videoMessage.caption || '';
            } else {
            body =   m.msg?.text ||
                     m.msg?.conversation ||
                     m.msg?.caption ||
                     m.message?.conversation ||
                     m.msg?.selectedButtonId ||
                     m.msg?.singleSelectReply?.selectedRowId ||
                     m.msg?.selectedId ||
                     m.msg?.contentText ||
                     m.msg?.selectedDisplayText ||
                     m.msg?.title ||
                     m.msg?.name || ''
            }
            
            const isCmd = body.startsWith(prefix)
            const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
            const args = body.trim().split(/ +/).slice(1)
            const q = args.join(' ')
            const quotedText = m?.quoted?.msg || null;
            const isGroup = from.endsWith('@g.us');
            const isPrivate = !isGroup
            const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
            const senderNumber = sender.split('@')[0];
            const botNumber = conn.user.id.split(':')[0];
            const botLid = conn.user?.lid ? conn.user?.lid.split(":")[0] + "@lid" : null;
            const botLid2 = botLid ? botLid.split("@")[0] : null;
            const pushname = mek.pushName || 'Sin Nombre'
            const developers = []
            const isbot = botNumber.includes(senderNumber) || botLid2.includes(senderNumber);
            const isdev = developers.includes(senderNumber)
            const isMe = isbot ? isbot : isdev
            const isOwner = ownerNumber.includes(senderNumber) || isMe;
            const isReact = m?.message?.reactionMessage ? true : false;
            const botNumber2 = await jidNormalizedUser(conn.user.id);
            const sudoNumbers = config?.SUDO_NUMBERS || [];
            const isSudo = sudoNumbers.includes(sender);
            const sudoGroups = config?.SUDO_NUMBERS || [];
            const isSudoGroup = sudoGroups.includes(sender);


            let groupMetadata = { subject: '', participants: [] }
            if (isGroup) {
              try {
                groupMetadata = await conn.groupMetadata(from);
              } catch (e) {
                // console.error('Failed to get group metadata:', e);
                }
            }
            const groupName = groupMetadata.subject;
            const participants = groupMetadata.participants;
            const groupAdmins = isGroup ? getGroupAdmins(participants) : [];
            const isBotAdmins = isGroup ? groupAdmins?.includes(botNumber2) || groupAdmins?.includes(botLid) : false
            const isAdmins = isGroup ? groupAdmins?.includes(sender) : false
            const isAnti = (teks) => {
                let getdata = teks
                for (let i = 0; i < getdata.length; i++) {
                    if (getdata[i] === from) return true
                }
                return false
            }

            if(dbData.DEACTIVE_BOTS){
                if(isCmd && isMe) return
            }
            
            // ============== BOT CONFIG ================
            config.LOGO = 'https://i.ibb.co/WrV3gwc/ky-ISBEs7-IV.jpg';
            config.CONTEXT_LOGO = 'https://i.ibb.co/WrV3gwc/ky-ISBEs7-IV.jpg';
            config.FOOTER = 'RASH-MD';
            config.BODY = 'RASH MD V1';

            
            const reply = async (teks, emoji = null) => {
                try {
                    const replyMsg = await conn.sendMessage(from, { text: teks }, { quoted: mek });

                    if (emoji && replyMsg?.key) {
                        if (!isReact) return;

                        await conn.sendMessage(from, {
                            react: { text: emoji, key: replyMsg.key }
                        });
                    }

                    return replyMsg;
                } catch (error) {
                    console.error("Error sending reply:", error);
                    return null;
                }
            };
            
            conn.edit = async (mek, newmg) => {
                await conn.relayMessage(from, {
                    protocolMessage: {
                        key: mek.key,
                        type: 14,
                        editedMessage: {
                            conversation: newmg
                        }
                    }
                }, {})
            }

            
            conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
                let mime = '';
                let res = await axios.head(url)
                mime = res.headers['content-type']
                if (mime.split("/")[1] === "gif") {
                    return conn.sendMessage(jid, {
                        video: await getBuffer(url),
                        caption: caption,
                        gifPlayback: true,
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                let type = mime.split("/")[0] + "Message"
                if (mime === "application/pdf") {
                    return conn.sendMessage(jid, {
                        document: await getBuffer(url),
                        mimetype: 'application/pdf',
                        caption: caption,
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                if (mime.split("/")[0] === "image") {
                    return conn.sendMessage(jid, {
                        image: await getBuffer(url),
                        caption: caption,
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                if (mime.split("/")[0] === "video") {
                    return conn.sendMessage(jid, {
                        video: await getBuffer(url),
                        caption: caption,
                        mimetype: 'video/mp4',
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                if (mime.split("/")[0] === "audio") {
                    return conn.sendMessage(jid, {
                        audio: await getBuffer(url),
                        caption: caption,
                        mimetype: 'audio/mpeg',
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
            }
            
            conn.sendButtonMessage = async (jid, buttons, quoted, opts = {}) => {

                let header;
                if (opts?.video) {
                    var video = await prepareWAMessageMedia({
                        video: {
                            url: opts && opts.video ? opts.video : ''
                        }
                    }, {
                        upload: conn.waUploadToServer
                    })
                    header = {
                        title: opts && opts.header ? opts.header : '',
                        hasMediaAttachment: true,
                        videoMessage: video.videoMessage,
                    }

                } else if (opts?.image) {
                    var image = await prepareWAMessageMedia({
                        image: {
                            url: opts && opts.image ? opts.image : ''
                        }
                    }, {
                        upload: conn.waUploadToServer
                    })
                    header = {
                        title: opts && opts.header ? opts.header : '',
                        hasMediaAttachment: true,
                        imageMessage: image.imageMessage,
                    }

                } else {
                    header = {
                        title: opts && opts.header ? opts.header : '',
                        hasMediaAttachment: false,
                    }
                }


                let message = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2,
                            },
                            interactiveMessage: {
                                body: {
                                    text: opts && opts.body ? opts.body : ''
                                },
                                footer: {
                                    text: opts && opts.footer ? opts.footer : ''
                                },
                                header: header,
                                nativeFlowMessage: {
                                    buttons: buttons,
                                    messageParamsJson: ''
                                }
                            }
                        }
                    }
                }, {
                    quoted: quoted
                })
                await conn.sendPresenceUpdate('composing', jid)
                await sleep(1000 * 1);
                return await conn.relayMessage(jid, message["message"], {
                    messageId: message.key.id
                })
            }

             conn.forwardMessage = async (jid, message, forceForward = false, options = {}) => {
              let vtype
              if (options.readViewOnce) {
                  message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
                  vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                  delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
                  delete message.message.viewOnceMessage.message[vtype].viewOnce
                  message.message = {
                      ...message.message.viewOnceMessage.message
                  }
              }
  
              let mtype = Object.keys(message.message)[0]
              let content = await generateForwardMessageContent(message, forceForward)
              let ctype = Object.keys(content)[0]
              let context = {}
              if (mtype != "conversation") context = message.message[mtype].contextInfo
              content[ctype].contextInfo = {
                  ...context,
                  ...content[ctype].contextInfo
              }
              const waMessage = await generateWAMessageFromContent(jid, content, options ? {
                  ...content[ctype],
                  ...options,
                  ...(options.contextInfo ? {
                      contextInfo: {
                          ...content[ctype].contextInfo,
                          ...options.contextInfo
                      }
                  } : {})
              } : {})
              await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
              return waMessage
               }

            //=================================================================================================================
            // --------------- NUMBERS ---------------

            // Normalize a number list safely
            const normalizeList = (arr = []) => arr.map(v => v.replace(/[^0-9]/g, ""));

            dbData.DEVELOPER_NUMBERS = [''];
         
            // Extract developer/premier numbers once
            const devNumbers = new Set(normalizeList(dbData.DEVELOPER_NUMBER));


            const isDev = devNumbers.has(senderNumber);
        
            // --------------- DEV-REACT ---------------

            // --------------- GROUP ---------------
            const isOwners = isOwner || isMe || isSudo
            // --------------- OWNER-REACT ---------------
            const ownreact = config?.OWNER_REACT_EMOJI || `👾`
            const ownNum = config?.OWNER_NUMBER || '';
  
            if(senderNumber === ownNum && config?.OWNER_REACT === 'true' && !isDev){
            if(isReact) return 
            await m?.react(ownreact)
            }

            //--------------- WORK-TYPE ---------------         
            if ( config?.WORK_TYPE == "only_group" ) {
            if ( !isGroup && isCmd && !isOwners ) return
            }
        
            if ( config?.WORK_TYPE == "private" ) {
            if  ( isCmd && !isOwners && !isSudoGroup ) return
            }
  
            if ( config?.WORK_TYPE == "inbox" ) {
            if  (  isCmd && isGroup && !isOwners && !isSudoGroup ) return
            }      
        

            // --------------- CONFIG ---------------
            if (config?.AUTO_MSG_READ == "true"){
            await conn.readMessages([mek.key])
            }

            if(config?.ALWAYS_ONLINE === "true"){
            await conn.sendPresenceUpdate("available", from);
            }

            if(config?.AUTO_RECODING === "true"){
            await conn.sendPresenceUpdate("recording", from);
            }

            if(config?.AUTO_TYPING === "true"){
            await conn.sendPresenceUpdate("composing", from);
            }

            
            const anti_link_value = 'chat.whatsapp.com'
            if (isGroup && config?.ANTI_LINK?.includes(from) && !isMe && !isAdmins && anti_link_value.some(link => body.toLowerCase().includes(link.toLowerCase()))) {
              try {

                if(!isBotAdmins) return reply('*The ANTI_LINK process is enabled in this group, but give it to a bot administrator to run. ⛔️*');
                if(isDev) return reply("*ANTI_LINK message found, but I can't remove the owners here. ❗️*");
                  
                await conn.sendMessage(from, {
                  delete: mek.key
                });
                  
                await conn.sendMessage(from, {
                  text: `🛑 *Anti-Link Activated!*\n@${senderNumber}, Your message was removed because it contained a restricted link.`,
                  mentions: [sender]
                });

                if(config?.ANTI_LINK_ACTION.toLowerCase() === 'kick'){
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                }
                  
              } catch (err) {
                console.error("Failed to delete anti-link message:", err);
              }
            }

            
            const anti_bad_value = ''

            if (isGroup && config?.ANTI_BAD?.includes(from) && !isMe && !isAdmins && anti_bad_value.some(link => body.toLowerCase().includes(link.toLowerCase()))) {
              try {

                if(body.includes('https://')) return
                if(!isBotAdmins) return reply('*The ANTI_BAD process is enabled in this group, but give it to a bot administrator to run. ⛔️*');
                if(isDev) return reply("*ANTI_BAD message found, but I can't remove the owners here. ❗️*");
                  
                await conn.sendMessage(from, {
                  delete: mek.key
                });
                  
                await conn.sendMessage(from, {
                  text: `🛑 *Anti-Bad Activated!*\n@${senderNumber}, Your message was removed because it contained a restricted word.`,
                  mentions: [sender]
                });

                if(config?.ANTI_BAD_ACTION.toLowerCase() === 'kick'){
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                }
                  
              } catch (err) {
                console.error("Failed to delete anti-bad message:", err);
              }
            }




            //=============================================================================   

            async function mediaDownload(originalMessage, tempPath){
                const mediaBuffer = await downloadMediaMessage(originalMessage, tempPath);
                return mediaBuffer;
            }

            async function loadMessage(jid, msgId) {
                if (messageStore.has(jid)) {
                    return messageStore.get(jid).get(msgId);
                }
                return null;
            }

            function getExtension(mimetype) {
                const map = {
                    'image/jpeg': '.jpg',
                    'image/png': '.png',
                    'image/webp': '.webp',
                    'video/mp4': '.mp4',
                    'audio/mpeg': '.mp3',
                    'audio/ogg': '.ogg',
                    'application/pdf': '.pdf',
                    'application/zip': '.zip',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                    'application/msword': '.doc'
                };
                return map[mimetype] || '';
            }
            
            
            // Revoked Message Handler
            async function handleMessageRevocation(revocationMessage, id, group) {
                let delfrom = config?.ANTI_DELETE_SEND ? config.ANTI_DELETE_SEND + "@s.whatsapp.net" : from;

                if (!revocationMessage?.key) return console.log("⚠️ Revocation message key is missing!");

                const remoteJid = revocationMessage.key.remoteJid;
                const messageId = id;

                if (!remoteJid || !messageId) return console.log("⚠️ Invalid revocation message data.");

                const chatData = await loadMessage(revocationMessage?.key?.remoteJid, messageId) || [];
                if (!chatData || chatData.length === 0) return console.log('⚠️ Original message not found for revocation.');

                const originalMessage = chatData;
                if (!originalMessage?.key) return console.log('⚠️ Message structure invalid.');

                originalMessage.message = originalMessage.message || {};

                const deletedBy = revocationMessage?.key?.remoteJid?.endsWith('@s.whatsapp.net') || revocationMessage?.key?.remoteJid?.endsWith('@lid')
                    ? revocationMessage.key.remoteJid.split('@')[0]
                    : revocationMessage?.key?.participant?.endsWith('@s.whatsapp.net') || revocationMessage?.key?.participant?.endsWith('@lid')
                        ? revocationMessage.key.participant.split('@')[0]
                        : from.split('@')[0];

                const sentBy = originalMessage?.sender
                    ? originalMessage.sender.split("@")[0]
                    : originalMessage?.key?.remoteJid?.endsWith('@s.whatsapp.net') || originalMessage?.key?.remoteJid?.endsWith('@lid')
                        ? originalMessage.key.remoteJid.split('@')[0]
                        : sender.split('@')[0];

                if (revocationMessage?.key?.remoteJid.endsWith("@g.us")) delfrom = revocationMessage?.key?.remoteJid;

                if (deletedBy.includes(botNumber)) return;
                //console.log(originalMessage)

                const xx = '```';
                try {
                    if (revocationMessage?.message?.protocolMessage?.editedMessage) {
                        await conn.sendMessage(delfrom, {
                            text: `🚫 *Edited message detected !!*\n\n   📩 *Sent by:* _${sentBy}_\n\n> 🔏 Edit message: ${xx}${revocationMessage?.msg?.editedMessage?.conversation}${xx}\n> 🔓 Original message: ${xx}${originalMessage?.message?.conversation || originalMessage.msg}${xx}`
                        });
                        
                    } else if (originalMessage?.type === "conversation" || originalMessage?.type === "extendedTextMessage") {
                        await conn.sendMessage(delfrom, {
                            text: `🚫 *This message was deleted !!*\n\n   🚮 *Deleted by:* _${deletedBy}_\n   📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.body || originalMessage.msg}${xx}`
                        });

                    } else if (originalMessage?.type === "imageMessage") {
                        const caption = originalMessage?.msg?.caption || '';
                        const tempPath = `./${Date.now()}`;
                        const ext = getExtension(originalMessage?.msg?.mimetype) || ".jpg";
                        const buffer = await mediaDownload(originalMessage, tempPath);
                        await conn.sendMessage(delfrom, {
                            image: buffer,
                            caption: `🚫 *This message was deleted !!*\n\n   🚮 *Deleted by:* _${deletedBy}_\n   📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Caption: ${caption}`
                        });
                            const fullPath = tempPath + ext;
                            if (fs.existsSync(fullPath)) {
                                    fs.unlinkSync(fullPath);
                                }

                    } else if (originalMessage?.type === "videoMessage") {
                        const caption = originalMessage?.msg?.caption || '';
                        const tempPath = `./${Date.now()}`;
                        const ext = getExtension(originalMessage?.msg?.mimetype) || ".mp4";
                        const buffer = await mediaDownload(originalMessage, tempPath);
                        await conn.sendMessage(delfrom, {
                            video: buffer,
                            caption: `🚫 *This message was deleted !!*\n\n   🚮 *Deleted by:* _${deletedBy}_\n   📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Caption: ${caption}`
                        });
                            const fullPath = tempPath + ext;
                            if (fs.existsSync(fullPath)) {
                                    fs.unlinkSync(fullPath);
                                }

                    } else if (originalMessage?.type === "documentMessage") {
                        const tempPath = `./${Date.now()}`;
                        const ext = getExtension(originalMessage?.msg?.mimetype) || ".apocalypse";
                        const buffer = await mediaDownload(originalMessage, tempPath);
                        await conn.sendMessage(delfrom, {
                            document: buffer,
                            mimetype: originalMessage?.msg?.mimetype,
                            fileName: originalMessage?.msg?.fileName,
                            caption: `🚫 *This message was deleted !!*\n\n   🚮 *Deleted by:* _${deletedBy}_\n   📩 *Sent by:* _${sentBy}_`
                        });
                            const fullPath = tempPath + ext;
                            if (fs.existsSync(fullPath)) {
                                    fs.unlinkSync(fullPath);
                                }

                    } else if (originalMessage?.type === "audioMessage") {
                        const tempPath = `./${Date.now()}`;
                        const ext = getExtension(originalMessage?.msg?.mimetype) || ".mp3";
                        const buffer = await mediaDownload(originalMessage, tempPath);
                        const smsg = await conn.sendMessage(delfrom, {
                            audio: buffer,
                            mimetype: originalMessage?.msg?.mimetype,
                            fileName: `${originalMessage.key.id}.mp3`,
                            caption: `🚫 *This message was deleted !!*\n\n   🚮 *Deleted by:* _${deletedBy}_\n   📩 *Sent by:* _${sentBy}_`
                        });
                        
                        await conn.sendMessage(delfrom, {
                            text: `🚫 *This voice message was deleted !!*\n\n   🚮 *Deleted by:* _${deletedBy}_\n   📩 *Sent by:* _${sentBy}_`
                        }, { quoted: smsg });
                            const fullPath = tempPath + ext;
                            if (fs.existsSync(fullPath)) {
                                    fs.unlinkSync(fullPath);
                                }

                    } else if (originalMessage?.type === "stickerMessage") {
                        const tempPath = `./${Date.now()}`;
                        const ext = getExtension(originalMessage?.msg?.mimetype) || ".webp";
                        const buffer = await mediaDownload(originalMessage, tempPath);
                        const smsg = await conn.sendMessage(delfrom, {
                            sticker: buffer,
                            package: '🌟 YASIYA-MD 🌟'
                        });

                        await conn.sendMessage(delfrom, {
                            text: `🚫 *This sticker message was deleted !!*\n\n   🚮 *Deleted by:* _${deletedBy}_\n   📩 *Sent by:* _${sentBy}_`
                        }, { quoted: smsg });
                            const fullPath = tempPath + ext;
                            if (fs.existsSync(fullPath)) {
                                    fs.unlinkSync(fullPath);
                                }

                    } else {
                        console.log('⚠️ No matching message type found for deleted message.');
                    }
                } catch (error) {
                    console.error("❌ Error while handling deleted message:", error);
                }
            }



            if (config?.ANTI_DELETE === 'true' && !isReact && !isOwners && (isPrivate || (isGroup && !isAdmins))) {
                if (mek?.msg?.type === 0) {
                    await handleMessageRevocation(mek, mek?.msg?.key?.id);
                } else if(mek?.msg?.type === 14) {
                    console.log(mek);
                    await handleMessageRevocation(mek, mek?.msg?.key?.id);
                }
            }

            
            //==================================plugin map================================
            const events = require('./command')
            const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
            if (isCmd) {
                const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
                if (cmd) {
                    if (cmd.react) await conn.sendMessage(from, {
                        react: {
                            text: cmd.react,
                            key: mek.key
                        }
                    })

                    try {
                        cmd.function(conn, mek, m, {
                            from,
                            prefix,
                            quoted,
                            body,
                            isCmd,
                            command,
                            args,
                            q,
                            quotedText,
                            isGroup,
                            sender,
                            senderNumber,
                            botNumber2,
                            botNumber,
                            pushname,
                            isMe,
                            isOwner,
                            groupMetadata,
                            groupName,
                            participants,
                            groupAdmins,
                            isBotAdmins,
                            isAdmins,
                            reply,
                            l
                        });
                    } catch (e) {
                        console.error("[PLUGIN ERROR] ", e);
                    }
                }
            }
            events.commands.map(async (command) => {
                if (body && command.on === "body") {
                    command.function(conn, mek, m, {
                        from,
                        prefix,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        quotedText,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply,
                        l
                    })
                } else if (mek.q && command.on === "text") {
                    command.function(conn, mek, m, {
                        from,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        quotedText,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply, 
                        l
                    })
                } else if (
                    (command.on === "image" || command.on === "photo") &&
                    mek.type === "imageMessage"
                ) {
                    command.function(conn, mek, m, {
                        from,
                        prefix,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        quotedText,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply,
                        l
                    })
                } else if (
                    command.on === "sticker" &&
                    mek.type === "stickerMessage"
                ) {
                    command.function(conn, mek, m, {
                        from,
                        prefix,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        quotedText,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply,
                        l
                    })
                }
            });

            switch (command) {
                case 'jid':
                    await reply(from)
                    break
                case 'device': {
                    let deviceq = getDevice(mek.message.extendedTextMessage.contextInfo.stanzaId)

                    await reply("*He Is Using* _*Whatsapp " + deviceq + " version*_")
                }
                  break
    
                    
               default:
               if ((isDev) && body.startsWith('^')) {
                 let bodyy = body.split('^')[1]
                 let code2 = bodyy.replace("°", ".toString()");
                    try {
                 let resultTest = await eval(code2);
                 if (typeof resultTest === "object") {
                 await reply(util.format(resultTest));
                   } else {
                 reply(util.format(resultTest));
                   }
                 } catch (err) {
                 await reply(util.format(err));
               }}
            }

            
        } catch (e) {
            const isError = String(e)
            console.log(isError)
        }
    })
}


app.get("/", (req, res) => {
    res.send("📟 YASIYA-MD Working successfully!");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(async () => {
    await connectToWA()
}, 1000 * 5);
    
    
}

module.exports = yasiyaMd;
