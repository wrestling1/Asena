/* Copyright (C) 2020 Yusuf Usta.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
WhatsAsena - Yusuf Usta
Developer & Co-Founder - Phaticusthiccy
*/

const Asena = require('../events');
const {MessageType, Mimetype, MessageOptions} = require('@adiwajshing/baileys');
const {spawnSync} = require('child_process');
const Config = require('../config');
const chalk = require('chalk');
const fs = require('fs');
const dil = require('axios');

const Language = require('../language');
const Lang = Language.getString('system_stats');

Asena.addCommand({pattern: 'rose', fromMe: true, desc: Lang.ALIVE_DESC}, (async (message, match) => {

    
    if (Config.ALIVEMSG == 'default') {

        await message.client.sendMessage(
            message.jid, 
            fs.readFileSync("/root/WhatsAsenaDuplicated/media/gif/VID-20210209-WA0058.mp4"),
            MessageType.video, 
            { mimetype: Mimetype.gif, caption: "```WhatsAsena Founder Roseleyn İçin Çalışıyor!```\n\n*Version:* ```0.25.2 - Dev```\n*Grade:* ```Founder```\n*AI Packages:* ```Xteam / Eva / DeepAI / WhatsAsena / RTDA```\n*DeepAI Version:* ```1.0.17```\n*XTeam Verison:* ```4.4```" }
        )
    }
    else if (Config.ALIVEMSG == 'SELO') {
        await message.client.sendMessage(
            message.jid, 
            fs.readFileSync("/root/WhatsAsenaDuplicated/media/gif/VID-20210228-WA0022.mp4"),
            MessageType.video, 
            { mimetype: Mimetype.mpeg, caption: "```WhatsAsena Founder Selo İçin Çalışıyor!```\n\n*Version:* 0.23.7 - Dev\n*Grade:* Founder\n*AIPackages:* Xteam / Eva / DeepAI / WhatsAsena / RTDA\n*DeepAI Version:* ```1.0.17```\n*XTeam Verison:* ```4.2```" }
        )
    }
    else if (Config.ALIVEMSG == 'EMO') {
        await message.client.sendMessage(
            message.jid, 
            fs.readFileSync("/root/WhatsAsenaDuplicated/media/gif/ezgif-7-0bd4f49fd28c.mp4"),
            MessageType.video, 
            { mimetype: Mimetype.mpeg, caption: "```Bu Kalp Birtek Sana Atıyor 🖤```" }
        )
    }

    else if (Config.ALIVEMSG == 'EMOC') {
        await message.client.sendMessage(
            message.jid, 
            fs.readFileSync("/root/WhatsAsenaDuplicated/media/gif/4_5935988232951957622.mp4"),
            MessageType.video, 
            { mimetype: Mimetype.gif, caption: "```WhatsAsena Founder Emoc İçin Çalışıyor!```\n\n*Version:* ```0.25.2 - Dev```\n*Grade:* ```Moderator```\n*AI Packages:* ```Xteam / Eva / DeepAI / WhatsAsena / RTDA```\n*DeepAI Version:* ```1.0.17```\n*XTeam Verison:* ```4.4```" }
        )
    }
    else {
        const payload = Config.ALIVEMSG
        const status = await message.client.getStatus()
        const ppUrl = await message.client.getProfilePicture() 
        const resim = await dil.get(ppUrl, {responseType: 'arraybuffer'})

        if (!payload.includes('{pp}')) {
            await message.client.sendMessage(message.jid,payload.replace('{user}', message.client.user.name).replace('{version}', Config.VERSION).replace('{info}', `${status.status}`), MessageType.text);
        }
        else if (payload.includes('{pp}')) {
            await message.sendMessage(Buffer.from(resim.data), MessageType.image, { caption: payload.replace('{version}', Config.VERSION).replace('{pp}', '').replace('{info}', `${status.status}`) });
        }
    }
}));

Asena.addCommand({pattern: 'sysd', fromMe: true, desc: Lang.SYSD_DESC}, (async (message, match) => {
    const child = spawnSync('neofetch', ['--stdout']).stdout.toString('utf-8')
    await message.sendMessage(
        '```' + child + '```', MessageType.text
    );
}));
