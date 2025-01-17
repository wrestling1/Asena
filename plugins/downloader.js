const Asena = require('../events');
const {MessageType} = require('@adiwajshing/baileys');
const got = require('got');
const fs = require('fs');
const axios = require('axios');
const { errorMessage, infoMessage } = require('../helpers');
const IG_DESC = "İnstagramdan Şəkil/Video Yükləyər"
const NEED_WORD = "Link Daxil etməlisən"
const FBDESC = "Facebookdan Video Yükləyər"
const LOADING = "Videonuz Yüklənilir..."
const NOT_FOUNDFB = "Video Tapılmadı"
const CAPTION = "Açıqlama"

Asena.addCommand({ pattern: 'instagram ?(.*)', fromMe: true, desc: IG_DESC}, async (message, match) => {

    const userName = match[1]

    if (!userName) return await message.sendMessage(errorMessage(NEED_WORD))

    await message.sendMessage(infoMessage("Downloading the Post..."))

    await axios
      .get(`https://api-anoncybfakeplayer.herokuapp.com/igdown?url=${userName}`)
      .then(async (response) => {
        const {
          url,
          type,
        } = response.data.result[0]

        const profileBuffer = await axios.get(url, {responseType: 'arraybuffer'})

        const msg = `${type}`

	 if (msg === 'image') { await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.image, {
          caption: "Made By WhatsAsena"
        })}
		 	 
	if (msg === 'video') { await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.video, {
          caption: "Made By WhatsAsena"
        })}
	
        
      })
      .catch(
        async (err) => await message.sendMessage(errorMessage("Invaild Link, Please Enter a Vaild Instagram Link")),
      )
  },
)




Asena.addCommand({ pattern: 'fb ?(.*)', fromMe: true, desc: FBDESC }, async (message, match) => {

    const userName = match[1]

    if (!userName) return await message.sendMessage(errorMessage(NEED_WORD))

    await message.sendMessage(infoMessage(LOADING))

    await axios
      .get(`https://videfikri.com/api/fbdl/?urlfb=${userName}`)
      .then(async (response) => {
        const {
          url,
          judul,
        } = response.data.result

        const profileBuffer = await axios.get(url, {responseType: 'arraybuffer'})

        const msg = `*${CAPTION}*: ${judul}`

        await message.sendMessage(Buffer.from(profileBuffer.data), MessageType.video, {
          caption: "Made By WhatsAsena"
        })
      })
      .catch(
        async (err) => await message.sendMessage(errorMessage(NOT_FOUNDFB )),
      )
  },
)
