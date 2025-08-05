const axios = require("axios");
const { cmd } = require("../command");
const config = require("../config");
const { fetchJson } = require("../lib/functions");
const GEMINI_API_KEY = "AIzaSyB8xtFPtvG_N9S7bBZZOSfTyZW8rQyJQkY";
const { blackbox } = require("../lib/scraper");

var queryMsg, noInputMsg, unsupportedLangMsg, errorMsg;


    queryMsg = "*Hellow i'am RUSH-MD AI System 🧠*";
    noInputMsg = "🤖 Please ask me something! Usage: ";
    unsupportedLangMsg = "❌ Unsupported language. Supported: ";
    errorMsg = "*An error occurred, please try again later ❌*";


cmd({
    pattern: "gemini",
    react: "👾",
    alias: ["geminiai", "geminichat", "ai2"],
    desc: "Use Gemini AI to get a response",
    category: "ai",
    use: "gemini < query >",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix }) => {
    const userMessage = args.join(" ");
    if (!userMessage) return await reply(noInputMsg, `\`${prefix}gemini your question\``);

    try {
        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userMessage }] }]
            }
        );

        const aiResponse = res.data.candidates[0].content.parts[0].text.trim();
        await reply(`🤖 *Google Gemini AI Response:*\n\n${aiResponse}\n\n> *${config.FOOTER}*`);
    } catch (error) {
        console.error("Google Gemini API Error:", error.response?.data || error.message);
        await reply("❌ *Error connecting to Gemini AI. Please try again later.*");
    }
});

cmd({
    pattern: "blackbox",
    react: "👾",
    alias: ["bbox", "bb", "ai"],
    desc: "Use BlackBox AI to get a response",
    category: "ai",
    use: "blackbox < query >",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return await reply(queryMsg, '🧠');
        }

        const scraperData = await blackbox(q);
        const apiData = await fetchJson("https://api.siputzx.my.id/api/ai/blackboxai-pro?content=" + q);
        const result = scraperData ? scraperData : apiData?.data;
        await reply(result, `🧠`);

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await reply(errorMsg);
    }
});


cmd({
    pattern: "meta",
    react: "👾",
    alias: ["metaai", "metachat", "ai4"],
    desc: "Use Meta AI to get a response",
    category: "ai",
    use: "meta < query >",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return await reply(queryMsg, '🧠');
        }
        
        const data = await fetchJson("https://api.siputzx.my.id/api/ai/metaai?query=" + q);
        await reply(data?.data, `🧠`);

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await reply(errorMsg);
    }
});


cmd({
    pattern: "chatgpt",
    react: "👾",
    alias: ["gptai", "chatgptchat", "ai5"],
    desc: "Use ChatGpt AI to get a response",
    category: "ai",
    use: "chatgpt < query >",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return await reply(queryMsg, '🧠');
        }

        let data;
        
        const res1 = await fetchJson("https://api.dreaded.site/api/chatgpt?text=" + q);

          if(res1.success === true && res1.result.prompt){
              data = res1.result.prompt
            await reply(data, `🧠`);
          } else {
              return await reply(errorMsg)
          }
        

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await reply(errorMsg);
    }
});


cmd({
    pattern: "aicode",
    react: "👾",
    alias: ["codeai", "codechat", "ai6"],
    desc: "Use AICode AI to get a code response",
    category: "ai",
    use: "aicode <language | prompt>",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("❗️Please provide a query like: `javascript | how to reverse a string`", '🧠');

        const supportedLangs = ["javascript", "typescript", "python", "swift", "ruby", "csharp", "go", "rust", "php", "matlab", "r"];

        let lang = 'javascript';
        let text = q;

        if (q.includes("|")) {
            const parts = q.split("|");
            lang = parts[0].trim().toLowerCase();
            text = parts.slice(1).join("|").trim();
        }

        if (!supportedLangs.includes(lang)) {
            return await reply(unsupportedLangMsg, ` ${supportedLangs.join(", ")}`);
        }

        const res = await fetchJson(`https://api.dreaded.site/api/aicode?prompt=${encodeURIComponent(text)}&language=${encodeURIComponent(lang)}`);

        if (res?.success && res?.result?.prompt?.code) {
            return await reply(res.result.prompt.code, '🧠');
        } else {
            return await reply("❌ AI response failed. Please try again.");
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(errorMsg);
    }
});


cmd({
    pattern: "imagegen",
    react: "👾",
    alias: ["imagegenai", "imagegenchat", "ai7"],
    desc: "Use ImageGen AI to get a response",
    category: "ai",
    use: "imagegen < query >",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return await reply(queryMsg, '🧠');
        }

        let data;
        
        const res1 = await fetchJson("https://api.dreaded.site/api/imagine?text=" + q);

          if(res1.success === true && res1.result){
              data = res1.result
            await conn.sendMessage(from, { image: { url: data }, caption: config.FOOTER }, { quoted: mek });
          } else {
              return await reply(errorMsg)
          }
        

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await reply(errorMsg);
    }
});
