const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({
    path: './config.env'
});

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || 'YASIYA-MD~IdYl3bYB#nRghIh0v8BuMbfyDE-GtrfbzQR10LHAshvCUgQ4-1vE',
    BOT_NUMBER: process.env.BOT_NUMBER || '',
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://mongo:jJmGQGCmWuVhYJQUAhMfvXwuPmIFaHTY@ballast.proxy.rlwy.net:54208'
};
