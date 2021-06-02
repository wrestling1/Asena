const Asena = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const axios = require('axios');
const request = require('request');
const got = require("got");
const QRReader = require('qrcode-reader');
const fs = require('fs');
const jimp = require('jimp');

// Sentances
const QR_DESC = "Sözü QR koduna çevirər"
const NEED_TEXT = "*Söz daxil etməlisən*"

Asena.addCommand({pattern: 'qr ?(.*)', fromMe: true, desc: QR_DESC}, (async (message, match) => {

    if (match[1] === '') return await message.sendMessage(NEED_TEXT);

    var webimage = await axios.get(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${match[1].replace(/#/g, '\n')} `, { responseType: 'arraybuffer' })

    await message.sendMessage(Buffer.from(webimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: "Made By WhatsAsena"})

}));

Asena.addCommand({ pattern: 'rqr', fromMe: true, dontAddCommandList: true, desc: 'Read QR' }, (async (message, match) => {
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });
    const img = await jimp.read(fs.readFileSync(location));

    const qr = new QRReader();
    const value = await new Promise((resolve, reject) => {
        qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
        qr.decode(img.bitmap);
      });
      await message.client.sendMessage(message.jid, value.result, MessageType.text, { quoted: message.data})
}));
