/*Codded by @phaticusthiccy
Telegram: https://t.me/phaticusthiccy
Instagram: https://instagram.com/kyrie.baran
*/

const Asena = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');
const Config = require('../config');
const cheerio = require('cheerio')
const FormData = require('form-data')
const Axios = require('axios');
const Upscaler = require('upscaler')
const Language = require('../language');
const Lang = Language.getString('conventer');

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}
var base64str = base64_encode('/root/WhatsAsenaDuplicated/media/68747470733a2f2f692e68697a6c69726573696d2e636f6d2f6d6d314e42732e6a7067_copy_160x160.jpeg');

function webp2mp4File(path) {
    return new Promise(async (resolve, reject) => {
        const bodyForm = new FormData()
        bodyForm.append('new-image-url', '')
        bodyForm.append('new-image', fs.createReadStream(path))
        await Axios({
            method: 'post',
            url: 'https://s6.ezgif.com/webp-to-mp4',
            data: bodyForm,
            headers: {
                'Content-Type': `multipart/form-data boundary=${bodyForm._boundary}`
            }
        }).then(async ({ data }) => {
            const bodyFormThen = new FormData()
            const $ = cheerio.load(data)
            const file = $('input[name="file"]').attr('value')
            const token = $('input[name="token"]').attr('value')
            const convert = $('input[name="file"]').attr('value')
            const gotdata = {
                file: file,
                token: token,
                convert: convert
            }
            bodyFormThen.append('file', gotdata.file)
            bodyFormThen.append('token', gotdata.token)
            bodyFormThen.append('convert', gotdata.convert)
            await Axios({
                method: 'post',
                url: 'https://ezgif.com/webp-to-mp4/' + gotdata.file,
                data: bodyFormThen,
                headers: {
                    'Content-Type': `multipart/form-data boundary=${bodyFormThen._boundary}`
                }
            }).then(({ data }) => {
                const $ = cheerio.load(data)
                const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
                resolve({
                    status: true,
                    message: "Made by WhatsAsena",
                    result: result
                })
            }).catch(reject)
        }).catch(reject)
    })
}

if (Config.WORKTYPE == 'private') {

    Asena.addCommand({pattern: 'enhancai', fromMe: true}, (async (message, match) => {    

        if (message.reply_message.image === false) return await message.client.sendMessage(message.jid, '*Fotoğrafa Yanıt Verin!*', MessageType.text);
        var downloading = await message.client.sendMessage(message.jid,'*Çevriliyor..*',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpeg')
            .on('end', async () => {
                await Upscaler.upscale('output.jpeg').then(async (upscaledImage) => {
                    fs.writeFileSync("/root/WhatsAsenaDuplicated/test.jpeg", upscaledImage);
                    await message.client.sendMessage(message.jid, fs.readFileSync('test.jpeg'), MessageType.image, {thumbnail: base64str, mimetype: Mimetype.jpeg, caption: 'Made for Founder'});
                })
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
    }));
    Asena.addCommand({pattern: 'mp4audio', fromMe: true, desc: Lang.MP4TOAUDİO_DESC}, (async (message, match) => {    

        if (message.reply_message === false) return await message.client.sendMessage(message.jid, Lang.MP4TOAUDİO_NEEDREPLY, MessageType.text);
        var downloading = await message.client.sendMessage(message.jid,Lang.MP4TOAUDİO,MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .withNoVideo()
            .save('output.mp3')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
    }));

    Asena.addCommand({pattern: 'imagesticker', fromMe: true, desc: Lang.STİCKER_DESC}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.client.sendMessage(message.jid, Lang.STİCKER_NEEDREPLY, MessageType.text);
        var downloading = await message.client.sendMessage(message.jid,Lang.STİCKER,MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .fromFormat('webp_pipe')
            .save('output.jpg')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
    }));
    Asena.addCommand({pattern: 'mp4sticker$', desc: 'Animasyonlu sticker\'i videoya çevirir.', fromMe: true}, (async (message, match) => {
        if (message.reply_message === false) return await message.sendMessage(Lang.STİCKER_NEEDREPLY);

        const savedFilename = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });
        await webp2mp4File(savedFilename).then(async (rest) => {
            await Axios({ method: "GET", url: rest.result, responseType: "stream"}).then(({ data }) => {
                const saving = data.pipe(fs.createWriteStream('/root/WhatsAsenaDuplicated/stweb.mp4'))
                saving.on("finish", async () => {
                    await message.client.sendMessage(message.jid, fs.readFileSync('/root/WhatsAsenaDuplicated/stweb.mp4'), MessageType.video, {thumbnail: base64str, mimetype: Mimetype.mp4, caption: 'Made by WhatsAsena', quoted: message.data })
                    if (fs.existsSync(savedFilename)) fs.unlinkSync(savedFilename)
                    if (fs.existsSync('/root/WhatsAsenaDuplicated/stweb.mp4')) fs.unlinkSync('/root/WhatsAsenaDuplicated/stweb.mp4')
                })
            })
        })
    }));
}
else if (Config.WORKTYPE == 'public') {

    Asena.addCommand({pattern: 'mp4audio', fromMe: false, desc: Lang.MP4TOAUDİO_DESC}, (async (message, match) => {    

        if (message.reply_message === false) return await message.client.sendMessage(message.jid, Lang.MP4TOAUDİO_NEEDREPLY, MessageType.text);
        var downloading = await message.client.sendMessage(message.jid,Lang.MP4TOAUDİO,MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .withNoVideo()
            .save('output.mp3')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
    }));

    Asena.addCommand({pattern: 'imagesticker', fromMe: false, desc: Lang.STİCKER_DESC}, (async (message, match) => {    

        if (message.reply_message === false) return await message.client.sendMessage(message.jid, Lang.STİCKER_NEEDREPLY, MessageType.text);
        var downloading = await message.client.sendMessage(message.jid,Lang.STİCKER,MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .fromFormat('webp_pipe')
            .save('output.jpg')
            .on('end', async () => {
                await message.client.sendMessage(message.jid, fs.readFileSync('output.jpg'), MessageType.image, {mimetype: Mimetype.jpg});
            });
        return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
    }));
    Asena.addCommand({pattern: 'mp4sticker$', desc: 'Animasyonlu sticker\'i videoya çevirir.' , fromMe: true}, (async (message, match) => {
        if (message.reply_message === false) return await message.sendMessage(Lang.STİCKER_NEEDREPLY);

        const savedFilename = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });
        await webp2mp4File(savedFilename).then(async (rest) => {
            await Axios({ method: "GET", url: rest.result, responseType: "stream"}).then(({ data }) => {
                const saving = data.pipe(fs.createWriteStream('/root/WhatsAsenaDuplicated/stweb.mp4'))
                saving.on("finish", async () => {
                    await message.client.sendMessage(message.jid, fs.readFileSync('/root/WhatsAsenaDuplicated/stweb.mp4'), MessageType.video, {thumbnail: base64str, mimetype: Mimetype.mp4, caption: 'Made for Founder', quoted: message.data })
                    if (fs.existsSync(savedFilename)) fs.unlinkSync(savedFilename)
                    if (fs.existsSync('/root/WhatsAsenaDuplicated/stweb.mp4')) fs.unlinkSync('/root/WhatsAsenaDuplicated/stweb.mp4')
                })
            })
        })
    }));
}
  
