const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions');
const DBM = require("../lib/database");
const { storenumrepdata } = require('../lib/numreply-db')
const dbData = require("../lib/config");
const ymd_db = new DBM();
const tableName = dbData.tableName;
const key = dbData.key;
const fs = require('fs');
const path = require('path');
// ============================= L A N G U A G E =============================
var errorMg, needOwner, groupOnly, needAdmin, giveMeAdmin, provideMessageForTag, userRemovedMessage, userRemovedFromGroup, userNotInGroupError, removeUserReplyError;

if (config.LANG === 'SI') {
    errorMg = '*දෝශයක් ඇති විය, කරුණාකර පසුව උත්සාහ කරන්න ❌*';
    needOwner = '*👑 මෙම විධානය භාවිතා කිරීමට ඔබ හිමිකරු විය යුතුය!*';
    groupOnly = '*👥 මෙම විධානය භාවිතා කළ හැක්කේ කණ්ඩායම් තුළ පමණි!*';
    needAdmin = '*🚨 මෙම විධානය භාවිතා කිරීමට ඔබ පරිපාලකයෙකු විය යුතුය!*';
    giveMeAdmin = '*🙏 කරුණාකර මට පරිපාලක බලතල ලබාදෙන්න!*';
} else if (config.LANG === 'TA') {
    errorMg = '*ஒரு பிழை ஏற்பட்டது, பின்னர் முயற்சிக்கவும் ❌*';
    needOwner = '*👑 இந்த கட்டளையை பயன்படுத்த நீங்கள் உரிமையாளர் ஆக இருக்க வேண்டும்!*';
    groupOnly = '*👥 இந்த கட்டளையை குழுக்களில் மட்டுமே பயன்படுத்த முடியும்!*';
    needAdmin = '*🚨 இந்த கட்டளையை பயன்படுத்த நீங்கள் நிர்வாகியாக இருக்க வேண்டும்!*';
    giveMeAdmin = '*🙏 தயவுசெய்து எனக்கு நிர்வாக அதிகாரம் கொடுங்கள்!*';
} else if (config.LANG === 'HI') {
    errorMg = '*एक त्रुटि उत्पन्न हुई, कृपया बाद में पुनः प्रयास करें ❌*';
    needOwner = '*👑 इस कमांड का उपयोग करने के लिए आपको मालिक होना चाहिए!*';
    groupOnly = '*👥 इस कमांड का उपयोग केवल समूहों में किया जा सकता है!*';
    needAdmin = '*🚨 इस कमांड का उपयोग करने के लिए आपको एक व्यवस्थापक होना चाहिए!*';
    giveMeAdmin = '*🙏 कृपया मुझे व्यवस्थापक अधिकार दें!*';
} else {
    errorMg = '*An error occurred, please try again later ❌*';
    needOwner = '*👑 You must be the owner to use this command!*';
    groupOnly = '*👥 This command can only be used in groups!*';
    needAdmin = '*🚨 You must be an admin to use this command!*';
    giveMeAdmin = '*🙏 Please grant me admin privileges!*';
}


if (config.LANG === 'SI') {
    provideMessageForTag = '❗ *කරුණාකර හැමෝම ටැග් කිරීමේ පණිවුඩයක් ලබා දෙන්න.*';
    userRemovedMessage = '*භාවිතාකරු දැනටමත් අයින් කරලා. 👨‍🔧*';
    userRemovedFromGroup = 'ඒ භාවිතාකරු කණ්ඩායමෙන් අයින් කර ඇත. ✔️';
    userNotInGroupError = '❌ *මෙම භාවිතාකරු මෙම කණ්ඩායම තුළ නොමැත.*';
    removeUserReplyError = '❌ *භාවිතාකරු ඉවත් කිරීමට පිළිතුරු දෙන්න හෝ ඔහුගේ අංකය ලබා දෙන්න.*';
} else if (config.LANG === 'TA') {
    provideMessageForTag = '❗ *எந்தெந்த மனிதர்களை டேக் செய்ய ஒரு செய்தி கொடுக்கவும்.*';
    userRemovedMessage = '*பயனருக்கு ஏற்கனவே நீக்கப்பட்டது. 👨‍🔧*';
    userRemovedFromGroup = 'இந்த பயனர் குழுவில் இருந்து நீக்கப்பட்டுள்ளது. ✔️';
    userNotInGroupError = '❌ *இந்த பயனர் இந்த குழுவில் இல்லை.*';
    removeUserReplyError = '❌ *பயனரை நீக்குவதற்கு பதிலளிக்கவும் அல்லது அவன் எண்ணை அளிக்கவும்.*';
} else if (config.LANG === 'HI') {
    provideMessageForTag = '❗ *कृपया सभी को टैग करने के लिए एक संदेश प्रदान करें.*';
    userRemovedMessage = '*उपयोगकर्ता को पहले ही हटा दिया गया है। 👨‍🔧*';
    userRemovedFromGroup = 'उपयोगकर्ता को समूह से हटा दिया गया है। ✔️';
    userNotInGroupError = '❌ *यह उपयोगकर्ता इस समूह में नहीं है।*';
    removeUserReplyError = '❌ *कृपया एक उपयोगकर्ता का उत्तर दें या उनका नंबर प्रदान करें ताकि उन्हें हटा सकें।*';
} else {
    provideMessageForTag = '❗ *Please provide a message to tag everyone.*';
    userRemovedMessage = '*User has already been removed. 👨‍🔧*';
    userRemovedFromGroup = 'has been removed from the group. ✔️';
    userNotInGroupError = '❌ *The user is not in this group.*';
    removeUserReplyError = '❌ *Please reply to a user or provide their number to remove.*';
}



async function updateEnv(tableName, key, setting, data, from, mek, conn, reply, remove = false) {
  try {
    const isInList = async (settingKey) => {
      const getdata = await ymd_db.get(tableName, key, settingKey);
      if (!Array.isArray(getdata)) return false;
      return getdata.includes(data);
    };

    if (!remove) {
      if (await isInList(setting)) return await reply("*⚠️ Already Exists*");

      let olddata = await ymd_db.get(tableName, key, setting);
      if (!Array.isArray(olddata)) olddata = [];

      olddata.push(data);
      await ymd_db.input(tableName, key, setting, olddata);
      await reply(`*${setting} Active Succussfully This Group ✅*`);
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

    } else {
      if (!await isInList(setting)) return await reply("*⚠️ Not Found in List*");

      const array = await ymd_db.get(tableName, key, setting);
      const indexToRemove = array.indexOf(data);
      if (indexToRemove !== -1) {
        array.splice(indexToRemove, 1);
        await ymd_db.input(tableName, key, setting, array);
      }

      await reply(`*${setting} Deactive Succussfully This Group ✅*`);
      await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });
    }

  } catch (e) {
    console.error("❌ updateEnv error:", e);
    await reply("*An error occurred while updating.*");
  }
}


cmd({
    pattern: "group",
    alias: ["gpsetting", "gpmenu"],
    react: "👨‍🔧",
    desc: "Group settings menu",
    category: "group",
    use: "group",
    filename: __filename
}, async (conn, m, mek, { from, q, reply, isGroup, isAdmins, isBotAdmins, isDev, prefix }) => {
    try {

	if (!isGroup) return reply(groupOnly);
	if (!isAdmins) { if (!isDev) return reply(needAdmin)}

        if (!isBotAdmins) return reply(giveMeAdmin);
	    
                if(config.MESSAGE_TYPE.toLowerCase() === "button"){ 

			const listData = {
  title: "🛠️ Configuration Settings",
  sections: [
    {
      title: "🛑 ANTI_LINK",
      rows: [
        { title: "Enable", description: "Set ANTI_LINK to true", id: `${prefix}gp_setting set ANTI_LINK` },
        { title: "Disable", description: "Set ANTI_LINK to false", id: `${prefix}gp_setting unset ANTI_LINK` },
      ],
    },
    {
      title: "🚫 ANTI_BAD",
      rows: [
        { title: "Enable", description: "Set ANTI_BAD to true", id: `${prefix}gp_setting set ANTI_BAD` },
        { title: "Disable", description: "Set ANTI_BAD to false", id: `${prefix}gp_setting unset ANTI_BAD` },
      ],
    },
    {
      title: "🤖 ANTI_BOT",
      rows: [
        { title: "Enable", description: "Set ANTI_BOT to true", id: `${prefix}gp_setting set ANTI_BOT` },
        { title: "Disable", description: "Set ANTI_BOT to false", id: `${prefix}gp_setting unset ANTI_BOT` },
      ],
    },
    {
      title: "👋 WELCOME_MESSAGE",
      rows: [
        { title: "Enable", description: "Set WELCOME_MESSAGE to true", id: `${prefix}gp_setting set WELLCOME_MESSAGE` },
        { title: "Disable", description: "Set WELCOME_MESSAGE to false", id: `${prefix}gp_setting unset WELLCOME_MESSAGE` },
      ],
    },
    {
      title: "💬 CHAT",
      rows: [
        { title: "Mute", description: "Mute chat", id: `${prefix}mute` },
        { title: "Unmute", description: "Unmute chat", id: `${prefix}unmute` },
      ],
    },
  ],
};

	await conn.sendMessage(from, {
          image: { url: config.LOGO },
          caption: '╭━━━ 🛠️ *Configuration Settings* ━━━╮',
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
			
let info = `
╭━━━ 🛠️ *Configuration Settings* ━━━╮

┃ 🛑 *ANTI_LINK*
┃    ┣ 1.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 1.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🚫 *ANTI_BAD*
┃    ┣ 2.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 2.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 🤖 *ANTI_BOT*
┃    ┣ 3.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 3.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 👋 *WELCOME_MESSAGE*
┃    ┣ 4.1 ➤ ᴛʀᴜᴇ (Enable)
┃    ┗ 4.2 ➤ ꜰᴀʟꜱᴇ (Disable)

┃ 💬 *CHAT*
┃    ┣ 5.1 ➤ ᴍᴜᴛᴇ
┃    ┗ 5.2 ➤ ᴜɴᴍᴜᴛᴇ

╰━━━━━━━━━━━━━━━━━━━━╯

${config.FOOTER}
`;

	       
	    
	const numrep = [];
        numrep.push(`1.1 ${prefix}gp_setting set ANTI_LINK`);
        numrep.push(`1.2 ${prefix}gp_setting unset ANTI_LINK`);
	    
        numrep.push(`2.1 ${prefix}gp_setting set ANTI_BAD`);
        numrep.push(`2.2 ${prefix}gp_setting unset ANTI_BAD`);
	    
        numrep.push(`3.1 ${prefix}gp_setting set ANTI_BOT`);
        numrep.push(`3.2 ${prefix}gp_setting unset ANTI_BOT`);
	    
        numrep.push(`4.1 ${prefix}gp_setting set WELLCOME_MESSAGE`);
        numrep.push(`4.2 ${prefix}gp_setting unset WELLCOME_MESSAGE`);
	    
        numrep.push(`5.1 ${prefix}mute`);
        numrep.push(`5.2 ${prefix}unmute`);


        const sentMsg = await conn.sendMessage(from, { image: { url:config.LOGO }, text: info,
                              contextInfo: {
                                      externalAdReply: {
                                          title: "👨‍🔧 𝖸𝖠𝖲𝖨𝖸𝖠-𝖬𝖣 𝖦𝖱𝖮𝖴𝖯 𝖲𝖤𝖳𝖳𝖨𝖭𝖦𝖲 👨‍🔧",
                                          body: config.BODY || "ᴘᴏᴡᴇʀᴇᴅ ʙʏ | ʏᴀꜱɪʏᴀ-ᴍᴅ ᴛᴇᴀᴍ",
                                          thumbnailUrl: config.CONTEXT_LOGO || config.LOGO,
                                          mediaType: 1,
                                          sourceUrl: q
                                      }}}, { quoted: mek });

	    
        const messageKey = sentMsg.key;
        await conn.sendMessage(from, { react: { text: '🛡', key: messageKey } });
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
    pattern: "gp_setting",
    react: "👨‍🔧",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, m, mek, { from, q, reply, isGroup, isAdmins, isBotAdmins, isDev }) => {
    try {

	if (!isGroup) return reply(groupOnly);
	if (!isAdmins) { if (!isDev) return reply(needAdmin)}

        if (!isBotAdmins) return reply(giveMeAdmin);
	const action = q.split(" ")[0];
	const actionConfig = q.split(" ")[1];

	    if(actionConfig === "ANTI_LINK"){
		    if(action === "set"){
			    await updateEnv(tableName, key, 'ANTI_LINK', from, from, mek, conn, reply, false);
		    } else {
			    await updateEnv(tableName, key, 'ANTI_LINK', from, from, mek, conn, reply, true);
		    }
	    } else if(actionConfig === "ANTI_BAD"){
		    if(action === "set"){
			    await updateEnv(tableName, key, 'ANTI_BAD', from, from, mek, conn, reply, false);
		    } else {
			    await updateEnv(tableName, key, 'ANTI_BAD', from, from, mek, conn, reply, true);
		    }
	    } else if(actionConfig === "ANTI_BOT"){
		    if(action === "set"){
			    await updateEnv(tableName, key, 'ANTI_BOT', from, from, mek, conn, reply, false);
		    } else {
			    await updateEnv(tableName, key, 'ANTI_BOT', from, from, mek, conn, reply, true);
		    }
	    } else if(actionConfig === "WELLCOME_MESSAGE"){
		    if(action === "set"){
			    await updateEnv(tableName, key, 'WELLCOME_MESSAGE', from, from, mek, conn, reply, false);
		    } else {
			    await updateEnv(tableName, key, 'WELLCOME_MESSAGE', from, from, mek, conn, reply, true);
		    }
	    } else return
	    

	    
    } catch (e) {
        console.log(e);
        await reply(errorMg, "❌");
    }
});


cmd({
    pattern: "mute",
    react: "🔇",
    alias: ["close","f_mute"],
    desc: "Change to group settings to only admins can send messages.",
    category: "group",
    use: 'mute',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins) { if (!isDev) return reply(needAdmin)}
if (!isBotAdmins) return reply(giveMeAdmin);
	
await conn.groupSettingUpdate(from, 'announcement')
 await conn.sendMessage(from , { text: `*Group Chat closed by Admin ${pushname}* 🔇` }, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


cmd({
    pattern: "unmute",
    react: "🔇",
    alias: ["open","f_unmute"],
    desc: "Change to group settings to all members can send messages.",
    category: "group",
    use: 'unmute',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins) { if (!isDev) return reply(needAdmin)}
if (!isBotAdmins) return reply(giveMeAdmin);
	
await conn.groupSettingUpdate(from, 'not_announcement')
 await conn.sendMessage(from , { text: `*Group Chat Opened by Admin ${pushname}* 🔇` }, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


cmd({
    pattern: "lockgs",
    react: "🔇",
    alias: ["lockgsettings"],
    desc: "Change to group settings to only admins can edit group info",
    category: "group",
    use: 'lockgs',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins) { if (!isDev) return reply(needAdmin)}
if (!isBotAdmins) return reply(giveMeAdmin);
	
await conn.groupSettingUpdate(from, 'locked')
 await conn.sendMessage(from , { text: `*Group settings Locked* 🔒` }, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})

cmd({
    pattern: "unlockgs",
    react: "🔓",
    alias: ["unlockgsettings"],
    desc: "Change to group settings to all members can edit group info",
    category: "group",
    use: 'unlockgs',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins) { if (!isDev) return reply(needAdmin)}
if (!isBotAdmins) return reply(giveMeAdmin);
	
await conn.groupSettingUpdate(from, 'unlocked')
 await conn.sendMessage(from , { text: `*Group settings Unlocked* 🔓` }, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


cmd({
    pattern: "leave",
    react: "🔓",
    alias: ["left","kickme","f_leave","f_left","f-left"],
    desc: "To leave from the group",
    category: "group",
    use: 'leave',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwners, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isOwners) return reply(needOwner);

	
 await conn.sendMessage(from , { text: `*Good Bye All* 👋🏻` }, { quoted: mek } )
 await conn.groupLeave(from) 
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


cmd({
    pattern: "updategname",
    react: "🔓",
    alias: ["upgname","gname"],
    desc: "To Change the group name",
    category: "group",
    use: 'updategname',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins) { if (!isDev) return reply(needAdmin)}
if (!isBotAdmins) return reply(giveMeAdmin);
	
if (!q) return reply("*Please write the new Group Subject* 🖊️")
await conn.groupUpdateSubject(from, q )
 await conn.sendMessage(from , { text: `✔️ *Group name Updated*` }, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


cmd({
    pattern: "updategdesc",
    react: "🔓",
    alias: ["upgdesc","gdesc"],
    desc: "To Change the group description",
    category: "group",
    use: 'updategdesc',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins) { if (!isDev) return reply(needAdmin)}
if (!isBotAdmins) return reply(giveMeAdmin);
	
if (!q) return reply("*Please write the new Group Description* 🖊️")
await conn.groupUpdateDescription(from, q )
 await conn.sendMessage(from , { text: `✔️ *Group Description Updated*` }, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme","f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: 'join < Group Link >',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwners, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isOwners) return reply(needOwner)
	
if (!q) return reply("*Please write the Group Link 🖇️*")
 let result = args[0].split('https://chat.whatsapp.com/')[1].split("?")[0];
 await conn.groupAcceptInvite(result)
     await conn.sendMessage(from , { text: `✔️ *Successfully Joined*`}, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})



cmd({
    pattern: "invite",
    react: "🖇️",
    alias: ["grouplink","glink"],
    desc: "To Get the Group Invite link",
    category: "group",
    use: 'invite',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins) { if (!isDev) return reply(needAdmin)}
if (!isBotAdmins) return reply(giveMeAdmin);
	
const code = await conn.groupInviteCode(from)

 await conn.sendMessage(from , { text: `🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/${code}`}, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})



cmd({
    pattern: "revoke",
    react: "🖇️",
    alias: ["revokegrouplink","resetglink","revokelink","f_revoke"],
    desc: "To Reset the group link",
    category: "group",
    use: 'revoke',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

        if (!isGroup) return reply(groupOnly);
        if (!isAdmins) { if (!isDev) return reply(needAdmin)}
        if (!isBotAdmins) return reply(giveMeAdmin);
	
await conn.groupRevokeInvite(from)
 await conn.sendMessage(from , { text: `*Group link Reseted* ⛔`}, { quoted: mek } )
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


cmd({
    pattern: "kick",
    react: "🥏",
    alias: ["remove"],
    desc: "To Remove a participant from Group",
    category: "group",
    use: 'kick',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, isGroup, isAdmins, isBotAdmins, isDev, participants, reply, msr }) => {
    try {
	    
        if (!isGroup) return reply(groupOnly);
        if (!isAdmins) { if (!isDev) return reply(needAdmin)}
        if (!isBotAdmins) return reply(giveMeAdmin);
	

			let users;
                        if (mek.quoted) {
                        users = mek.quoted.sender;
                        } else if (mek?.msg?.contextInfo?.mentionedJid[0]) {
                        users = mek?.msg?.contextInfo?.mentionedJid[0];
                        }

        if (!users) return reply(removeUserReplyError);
	    
        const isUserInGroup = participants.some(member => member.id === users);
        if (!isUserInGroup) return reply(userNotInGroupError);
        let response = await conn.groupParticipantsUpdate(from, [users], "remove");

        if (response && response[0].status === "200") {
            await conn.sendMessage(from, { 
                text: `@${users.split("@")[0]} ` + userRemovedFromGroup,
                mentions: [users] 
            }, { quoted: mek });
        } else {
            await reply(userRemovedMessage);
        }

    } catch (e) {
        console.error(e);
        reply(errorMg, "❌")
}
})


cmd({
    pattern: "addmember",
    react: "➕",
    alias: ["add", "invite"],
    desc: "To Add a Member to the Group",
    category: "group",
    use: 'addmember <phone_number>',
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isDev, isOwner, isBotAdmins, reply, msr }) => {
    try {
	    
        if (!isGroup) return reply(groupOnly);
        if (!isAdmins) { if (!isDev) return reply(needAdmin)}
        if (!isBotAdmins) return reply(giveMeAdmin);
	
        if (!q) return reply('*❗ Please provide a phone number or invite link to add a member.*');

        let number = q.replace(/[^\d+]/g, "");  // Ensure it's a valid number
	if (number.length === 0) return reply('*❗ No valid phone numbers found. Please check the format.*');

        if (!number.includes("@s.whatsapp.net")) number = `${number}@s.whatsapp.net`;

        await conn.groupParticipantsUpdate(from, [number], "add");

        reply(`✅ Successfully added ${number} to the group.`);

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        reply(errorMg, "❌")
}
})


cmd({
    pattern: "promote",
    react: "🥏",
    alias: ["addadmin"],
    desc: "To Add a participatant as a Admin",
    category: "group",
    use: 'promote',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag , args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

        if (!isGroup) return reply(groupOnly);
	if (!isAdmins) { if (!isDev) return reply(needAdmin)}
        if (!isBotAdmins) return reply(giveMeAdmin); 
	
			let users;
                        if (mek.quoted) {
                        users = mek.quoted.sender;
                        } else if (mek?.msg?.contextInfo?.mentionedJid[0]) {
                        users = mek?.msg?.contextInfo?.mentionedJid[0];
                        }
	
		if (!users) return reply(removeUserReplyError)
	
		const groupAdmins = await getGroupAdmins(participants) 
		if  ( groupAdmins.includes(users)) return await conn.sendMessage(from,{ text:`*@${users.split("@")[0]} Already an Admin* ❗`, mentions: [users] },{ quoted:mek })
		await conn.groupParticipantsUpdate(from, [users], "promote")
		await conn.sendMessage(from, { text:`*@${users.split("@")[0]} promoted as an Admin*  ✔️`, mentions: [users] },{ quoted:mek })
	
	
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})

cmd({
    pattern: "demote",
    react: "🥏",
    alias: ["removeadmin"],
    desc: "To Demote Admin to Member",
    category: "group",
    use: 'demote',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag , args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

        if (!isGroup) return reply(groupOnly);
	if (!isAdmins) { if (!isDev) return reply(needAdmin)}
        if (!isBotAdmins) return reply(giveMeAdmin);
	
		        let users;
                        if (mek.quoted) {
                        users = mek.quoted.sender;
                        } else if (mek?.msg?.contextInfo?.mentionedJid[0]) {
                        users = mek?.msg?.contextInfo?.mentionedJid[0];
                        }
	
		if (!users) return reply(removeUserReplyError)
		const groupAdmins = await getGroupAdmins(participants) 
		if  (!groupAdmins.includes(users)) return await conn.sendMessage(from,{ text:`*@${users.split("@")[0]} Already not an Admin* ❗`, mentions: [users] },{ quoted:mek })
		await conn.groupParticipantsUpdate(from, [users], "demote")
		await conn.sendMessage(from,{ text:`*@${users.split("@")[0]} No longer an Admin*  ✔️`, mentions: [users] },{ quoted:mek })
	
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["f_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: 'tagall',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, mentionByTag , args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

        if (!isGroup) return reply(groupOnly);
	if (!isAdmins) { if (!isDev) return reply(needAdmin)}


		let teks = `💱 *HI ALL ! GIVE YOUR ATTENTION PLEASE* 
 
`
                for (let mem of participants) {
                teks += `🥎 @${mem.id.split('@')[0]}\n`
                }
                conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek })
                
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})

cmd({
    pattern: "hidetag",
    react: "🔊",
    alias: ["tag", "f_tag"],
    desc: "To Tag all Members for Message",
    category: "group",
    use: 'tag Hi',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, isGroup, isAdmins, isDev, participants, reply, msr }) => {
    try {
	    
        if (!isGroup) return reply(groupOnly);
	if (!isAdmins) { if (!isDev) return reply(needAdmin)}

		    
        let messageText = q || (quoted && quoted?.msg);
        if (!messageText) return reply(provideMessageForTag);

        await conn.sendMessage(from, { 
            text: messageText, 
            mentions: participants.map(a => a.id) 
        }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        reply(errorMg, "❌")
}
})


cmd({
    pattern: "taggp",
    react: "🔊",
    alias: ["tggp", "f_taggp"],
    desc: "To Tag all Members for a Message in another Group",
    category: "group",
    use: 'taggp <group_jid>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, isGroup, isDev, reply, isMe, isOwners }) => {
    try {
        if (!isOwners) return reply('*❗ This command can only be used by owners.*');
        if (!quoted) return reply('*❗ Please reply to a message to send.*');
        if (!q || !q.includes("@g.us")) return reply('*❗ Please provide a valid Group JID.*');

        let teks = m?.quoted?.msg ? m.quoted.msg : m?.quoted?.text ? m.quoted.text : "*No message content*";
        const jid = q.split("@g.us")[0].trim() + "@g.us";

        let groupMetadata;
        try {
            groupMetadata = await conn.groupMetadata(jid);
        } catch (err) {
            return reply(`❌ *Failed to fetch group data. Is the bot in the group?*`);
        }

        const participants = groupMetadata.participants || [];

        await conn.sendMessage(
            jid, 
            { 
                text: teks, 
                mentions: participants.map(a => a?.phoneNumber || a?.id) 
            }
        );

        await reply(`✅ *Message successfully sent to group:* ${groupMetadata.subject}`);

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        reply(errorMg, "❌")
}
})


cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get group informations.",
    category: "group",
    use: 'ginfo',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, msr, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{

if (!isGroup) return reply(groupOnly);
if (!isAdmins && !isDev) {
return reply(needAdmin);
}
if (!isBotAdmins) return reply(giveMeAdmin);
	
const metadata = await conn.groupMetadata(from) 
let ppUrl = await conn.profilePictureUrl( from , 'image')
const gdata = `\n*${metadata.subject}*

🐉 *Group Jid* - ${metadata.id}

📬 *Participant Count* - ${metadata.size}

👤 *Group Creator* - ${metadata.owner}

📃 *Group Description* - ${metadata.desc}\n\n`
await conn.sendMessage(from,{image:{url: ppUrl },caption: gdata + config.FOOTER },{quoted:mek })
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(errorMg, "❌")
}
})


//==============================================

// Create snapshots directory if it doesn't exist
const snapshotsDir = path.join(__dirname, '..', 'snapshots');
if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
}

// Helper function to get snapshot file path
function getSnapshotPath(groupId) {
    return path.join(snapshotsDir, `${groupId.replace(/@g\.us/g, '')}.json`);
}

// Helper function to download and save group icon
async function saveGroupIcon(conn, groupMetadata, snapshotId) {
    try {
        if (groupMetadata.pictureUrl) {
            const iconPath = path.join(snapshotsDir, `icon_${snapshotId}.jpg`);
            const response = await require('axios').get(groupMetadata.pictureUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(iconPath, response.data);
            return iconPath;
        }
        return null;
    } catch (error) {
        console.log('Error saving group icon:', error.message);
        return null;
    }
}

// Helper function to restore group icon
async function restoreGroupIcon(conn, groupId, iconPath) {
    try {
        if (iconPath && fs.existsSync(iconPath)) {
            const iconBuffer = fs.readFileSync(iconPath);
            await conn.updateProfilePicture(groupId, iconBuffer);
            return true;
        }
        return false;
    } catch (error) {
        console.log('Error restoring group icon:', error.message);
        return false;
    }
}

// Create snapshot command
cmd({
    pattern: "snapshot",
    react: "📸",
    alias: ["createsnap", "snap"],
    desc: "Create a snapshot of current group settings",
    category: "group",
    use: '.snapshot [name]',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, groupMetadata, args, reply, isOwners }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmins && !isOwners) return reply("❌ Only group admins can create snapshots!");
        if (!isBotAdmins) return reply("❌ Bot must be an admin to create snapshots!");

        const snapshotName = args.join(' ') || `Snapshot_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
        const snapshotId = `${from.replace(/@g\.us/g, '')}_${Date.now()}`;
        
        // Get current group picture URL
        let pictureUrl = null;
        try {
            pictureUrl = await conn.profilePictureUrl(from, 'image');
        } catch (error) {
            console.log('No group picture found');
        }

        // Save group icon
        const iconPath = await saveGroupIcon(conn, { pictureUrl }, snapshotId);

        // Create snapshot data with JID included
        const snapshotData = {
            id: snapshotId,
            name: snapshotName,
            createdAt: new Date().toISOString(),
            createdBy: mek.key.participant || mek.key.remoteJid,
            groupJid: from, // Added group JID
            groupData: {
                subject: groupMetadata.subject,
                desc: groupMetadata.desc || '',
                pictureUrl: pictureUrl,
                iconPath: iconPath,
                jid: from // Also store JID in groupData for redundancy
            }
        };

        // Load existing snapshots
        const snapshotPath = getSnapshotPath(from);
        let snapshots = [];
        if (fs.existsSync(snapshotPath)) {
            snapshots = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
        }

        // Add new snapshot
        snapshots.push(snapshotData);

        // Keep only last 10 snapshots
        if (snapshots.length > 10) {
            const oldSnapshot = snapshots.shift();
            // Clean up old icon file
            if (oldSnapshot.groupData.iconPath && fs.existsSync(oldSnapshot.groupData.iconPath)) {
                fs.unlinkSync(oldSnapshot.groupData.iconPath);
            }
        }

        // Save snapshots
        fs.writeFileSync(snapshotPath, JSON.stringify(snapshots, null, 2));

        await reply(`✅ *Group Snapshot Created Successfully!*

📸 *Snapshot Name:* ${snapshotName}
🆔 *Snapshot ID:* ${snapshotId}
📅 *Created:* ${new Date().toLocaleString()}
🔗 *Group JID:* ${from}

*Saved Data:*
📝 Group Name: ${groupMetadata.subject}
📄 Description: ${groupMetadata.desc ? 'Saved' : 'No description'}
🖼️ Group Icon: ${iconPath ? 'Saved' : 'No icon'}

💡 *Use* \`.listsnapshots\` *to view all snapshots*
💡 *Use* \`.restore [snapshot_id]\` *to restore a snapshot*`);

    } catch (error) {
        console.error('Error creating snapshot:', error);
        await reply("❌ Error creating snapshot. Please try again.");
    }
});

// List snapshots command
cmd({
    pattern: "listsnapshots",
    react: "📋",
    alias: ["snapshots", "listsnap"],
    desc: "List all group snapshots",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        const snapshotPath = getSnapshotPath(from);
        if (!fs.existsSync(snapshotPath)) {
            return reply("📭 No snapshots found for this group!\n\n💡 Use `.snapshot` to create your first snapshot.");
        }

        const snapshots = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
        if (snapshots.length === 0) {
            return reply("📭 No snapshots found for this group!");
        }

        let message = "📸 *GROUP SNAPSHOTS*\n\n";
        message += `🔗 *Group JID:* ${from}\n\n`;
        
        snapshots.forEach((snapshot, index) => {
            const createdDate = new Date(snapshot.createdAt).toLocaleString();
            const creatorNumber = snapshot.createdBy.split('@')[0];
            
            message += `*${index + 1}. ${snapshot.name}*\n`;
            message += `🆔 ID: \`${snapshot.id}\`\n`;
            message += `📅 Created: ${createdDate}\n`;
            message += `👤 By: ${creatorNumber}\n`;
            message += `📝 Name: ${snapshot.groupData.subject}\n`;
            message += `📄 Desc: ${snapshot.groupData.desc ? '✅' : '❌'}\n`;
            message += `🖼️ Icon: ${snapshot.groupData.iconPath ? '✅' : '❌'}\n`;
            message += `🔗 JID: ${snapshot.groupJid || snapshot.groupData.jid || 'N/A'}\n\n`;
        });

        message += "💡 *Use* `.restore [snapshot_id]` *to restore a snapshot*\n";
        message += "💡 *Use* `.deletesnap [snapshot_id]` *to delete a snapshot*";

        await reply(message);

    } catch (error) {
        console.error('Error listing snapshots:', error);
        await reply("❌ Error loading snapshots. Please try again.");
    }
});

// Restore snapshot command
cmd({
    pattern: "restore",
    react: "🔄",
    alias: ["restoresnap"],
    desc: "Restore group from snapshot",
    category: "group",
    use: '.restore [snapshot_id]',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, reply, isOwners }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmins && !isOwners) return reply("❌ Only group admins can restore snapshots!");
        if (!isBotAdmins) return reply("❌ Bot must be an admin to restore snapshots!");

        if (!args[0]) return reply("❌ Please provide a snapshot ID!\n\n💡 Use `.listsnapshots` to view available snapshots.");

        const snapshotId = args[0];
        const snapshotPath = getSnapshotPath(from);
        
        if (!fs.existsSync(snapshotPath)) {
            return reply("📭 No snapshots found for this group!");
        }

        const snapshots = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
        const snapshot = snapshots.find(s => s.id === snapshotId || s.id.includes(snapshotId));

        if (!snapshot) {
            return reply("❌ Snapshot not found!\n\n💡 Use `.listsnapshots` to view available snapshots.");
        }

        const restoringMsg = await reply("🔄 *Restoring group snapshot...*\n\nPlease wait while I restore the group settings...");

        let restoredItems = [];
        let failedItems = [];

        try {
            // Restore group name
            await conn.groupUpdateSubject(from, snapshot.groupData.subject);
            restoredItems.push("📝 Group Name");
        } catch (error) {
            failedItems.push("📝 Group Name: " + error.message);
        }

        try {
            // Restore group description
            if (snapshot.groupData.desc) {
                await conn.groupUpdateDescription(from, snapshot.groupData.desc);
                restoredItems.push("📄 Group Description");
            }
        } catch (error) {
            failedItems.push("📄 Group Description: " + error.message);
        }

        try {
            // Restore group icon
            if (snapshot.groupData.iconPath) {
                const iconRestored = await restoreGroupIcon(conn, from, snapshot.groupData.iconPath);
                if (iconRestored) {
                    restoredItems.push("🖼️ Group Icon");
                } else {
                    failedItems.push("🖼️ Group Icon: File not found or corrupted");
                }
            }
        } catch (error) {
            failedItems.push("🖼️ Group Icon: " + error.message);
        }

        // Edit the restoring message with results
        let resultMessage = `✅ *Group Snapshot Restored!*

📸 *Snapshot:* ${snapshot.name}
🔗 *Group JID:* ${snapshot.groupJid || snapshot.groupData.jid || from}
📅 *Restored:* ${new Date().toLocaleString()}

*Successfully Restored:*
${restoredItems.length > 0 ? restoredItems.map(item => `✅ ${item}`).join('\n') : '❌ No items were restored'}`;

        if (failedItems.length > 0) {
            resultMessage += `\n\n*Failed to Restore:*\n${failedItems.map(item => `❌ ${item}`).join('\n')}`;
        }

        await conn.sendMessage(from, { text: resultMessage }, { quoted: mek });

    } catch (error) {
        console.error('Error restoring snapshot:', error);
        await reply("❌ Error restoring snapshot. Please try again.");
    }
});

// Delete snapshot command
cmd({
    pattern: "deletesnap",
    react: "🗑️",
    alias: ["delsnap", "removesnap"],
    desc: "Delete a group snapshot",
    category: "group",
    use: '.deletesnap [snapshot_id]',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, args, reply, isOwners }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmins && !isOwners) return reply("❌ Only group admins can delete snapshots!");

        if (!args[0]) return reply("❌ Please provide a snapshot ID!\n\n💡 Use `.listsnapshots` to view available snapshots.");

        const snapshotId = args[0];
        const snapshotPath = getSnapshotPath(from);
        
        if (!fs.existsSync(snapshotPath)) {
            return reply("📭 No snapshots found for this group!");
        }

        let snapshots = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
        const snapshotIndex = snapshots.findIndex(s => s.id === snapshotId || s.id.includes(snapshotId));

        if (snapshotIndex === -1) {
            return reply("❌ Snapshot not found!\n\n💡 Use `.listsnapshots` to view available snapshots.");
        }

        const snapshot = snapshots[snapshotIndex];
        
        // Clean up icon file
        if (snapshot.groupData.iconPath && fs.existsSync(snapshot.groupData.iconPath)) {
            fs.unlinkSync(snapshot.groupData.iconPath);
        }

        // Remove snapshot from array
        snapshots.splice(snapshotIndex, 1);

        // Save updated snapshots
        fs.writeFileSync(snapshotPath, JSON.stringify(snapshots, null, 2));

        await reply(`✅ *Snapshot Deleted Successfully!*

📸 *Deleted Snapshot:* ${snapshot.name}
🆔 *ID:* ${snapshot.id}
🔗 *Group JID:* ${snapshot.groupJid || snapshot.groupData.jid || 'N/A'}
📅 *Deleted:* ${new Date().toLocaleString()}

💡 *Use* \`.listsnapshots\` *to view remaining snapshots*`);

    } catch (error) {
        console.error('Error deleting snapshot:', error);
        await reply("❌ Error deleting snapshot. Please try again.");
    }
});

// Clear all snapshots command
cmd({
    pattern: "clearsnapshots",
    react: "🧹",
    alias: ["clearsnap", "purgesnapshots"],
    desc: "Delete all group snapshots",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply, isOwners }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmins && !isOwners) return reply("❌ Only group admins can clear snapshots!");

        const snapshotPath = getSnapshotPath(from);
        
        if (!fs.existsSync(snapshotPath)) {
            return reply("📭 No snapshots found for this group!");
        }

        const snapshots = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
        
        if (snapshots.length === 0) {
            return reply("📭 No snapshots to clear!");
        }

        // Clean up all icon files
        snapshots.forEach(snapshot => {
            if (snapshot.groupData.iconPath && fs.existsSync(snapshot.groupData.iconPath)) {
                fs.unlinkSync(snapshot.groupData.iconPath);
            }
        });

        // Delete snapshots file
        fs.unlinkSync(snapshotPath);

        await reply(`🧹 *All Snapshots Cleared!*

🗑️ *Deleted:* ${snapshots.length} snapshots
🔗 *Group JID:* ${from}
📅 *Cleared:* ${new Date().toLocaleString()}

💡 *Use* \`.snapshot\` *to create new snapshots*`);

    } catch (error) {
        console.error('Error clearing snapshots:', error);
        await reply("❌ Error clearing snapshots. Please try again.");
    }
});


cmd({
  pattern: "kickall",
  react: "🧨",
  desc: "Kick all non-admin members (with confirmation)",
  category: "dev",
  filename: __filename
},
async (conn, m, mek, { from, q, isGroup, isAdmins, isBotAdmins, participants, groupMetadata, reply, isDev, prefix, botNumber2, botLid }) => {
  try {
    const input = q.trim().toLowerCase();
	  
    if (!isGroup) return reply(groupOnly);
    if (!isDev) return reply(needOwner);
    if (!isBotAdmins) return reply(giveMeAdmin);
	  
    const SKIP_LIST = dbData.DEVELOPER_NUMBERS || [];

    switch (input) {
      case "true":
        const groupOwner = groupMetadata.owner || participants.find(p => p.admin === "superadmin")?.id;
  
        const membersToKick = participants.filter(p => {
          const number = p.id.split("@")[0];
          return (
            p.id !== botLid &&
	    p.id !== botNumber2 &&
            p.id !== groupOwner &&
            p.admin !== "admin" &&
            !SKIP_LIST.includes(number)
          );
        }).map(p => p.id);

        if (membersToKick.length === 0) return reply("*No non-admin members to kick.*");

        reply(`*Kicking ${membersToKick.length} members...*`);
        for (let id of membersToKick) {
          await sleep(1000);
          await conn.groupParticipantsUpdate(from, [id], "remove");
        }
        reply("*✅ Kick completed.*");
        break;

      case "false": 
        return reply("*❌ Kick canceled.*");

      default:

        const info = "*⚠️ Confirm Kick*\n\nDo you want to kick all non-admin members?\n\n01. ✅ YES\n02. ❌ NO";

        const numrep = [];
        numrep.push(`${prefix}kickall true`);
        numrep.push(`${prefix}kickall false`);

        const sentMsg = await conn.sendMessage(from, { text: info }, { quoted: mek });
        const messageKey = sentMsg.key;

        const jsonmsg = {
          key: messageKey,
          numrep,
          method: "nondecimal"
        };
        await storenumrepdata(jsonmsg);
        break;
    }

  } catch (e) {
    console.error("kickall error:", e);
    reply("*Error occurred while handling kickall.*");
  }
});

