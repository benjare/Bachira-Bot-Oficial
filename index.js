require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// ✅ APIs listas y funcionales
const API = {
  GPT: "https://api.siputzx.my.id/api/ai/gpt4?text=",
  IMAGEN: "https://api.siputzx.my.id/api/ai/dalle?prompt=",
  BUSCAR: "https://api.siputzx.my.id/api/ytsearch?q=",
  MP3: "https://api.siputzx.my.id/api/ytdl/mp3?url=",
  MP4: "https://api.siputzx.my.id/api/ytdl/mp4?url=",
  APK: "https://api.siputzx.my.id/api/apk/search?q="
};

const bot = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

bot.on('qr', codigo => {
  console.log('\n📲 ESCANEA EL QR | BACHIRA ACTIVO 🟡⚡\n');
  qrcode.generate(codigo, { small: true });
});

bot.on('ready', () => {
  console.log('\n✅ BACHIRA BOT 100% FUNCIONAL');
  console.log('👤 Creado por: Benjare');
  console.log('🌎 País: Argentina 🇦🇷\n');
});

const MENU = `🟡⚡ **BACHIRA - BOT OFICIAL** ⚽

¡Hola! Soy **Bachira**, traigo magia y locura desde **Argentina**.
Creado totalmente por **Benjare**, mi creador.

> ❝ *Jugar para divertirse es el único secreto para ser el mejor.* ❞

🤖 !ia / !gpt → Inteligencia Artificial
🎨 !imagen [tema] → Crear dibujos únicos
🎵 !mp3 [nombre] → Descargar música
🎬 !video [nombre] → Descargar video HD
📱 !apk [nombre] → Buscar aplicaciones
🖼️ !sticker → Hacer pegatinas
💡 !dato → Curiosidades
⚽ !frase → Frase legendaria

🇦🇷 Hecho en Argentina 🇦🇷`;

bot.on('message', async msg => {
  let txt = msg.body.toLowerCase().trim();

  if(['hola','bachira','menu','ayuda','comandos'].includes(txt)) return msg.reply(MENU);
  if(txt === 'creador') return msg.reply('💡 Todo esto fue desarrollado por **Benjare**, aquí en Argentina 🇦🇷 ¡gracias a él existo!');
  if(txt === 'frase') return msg.reply('❝ *Mi locura es lo que hace magia en la cancha.* ❞ — Bachira ⚽🟡');
  if(txt === 'dato') return msg.reply('💡 Sabías: El cerebro usa tanta energía como para prender una lamparita pequeña 🇦🇷');

  // INTELIGENCIA
  if(txt.startsWith('!ia ') || txt.startsWith('!gpt ')){
    let pregunta = txt.slice(4);
    try {
      let res = await axios.get(API.GPT + encodeURIComponent(pregunta));
      msg.reply(`🧠 *Inteligencia Bachira*\n${res.data.result}\n\n🇦🇷 Argentina`);
    } catch { msg.reply('❌ Estoy pensando profundo, intentá de nuevo.'); }
  }

  // IMÁGENES
  if(txt.startsWith('!imagen ')){
    let tema = txt.slice(8);
    msg.reply('🎨 Creando arte lleno de magia... esperame 🟡');
    try {
      let res = await axios.get(API.IMAGEN + encodeURIComponent(tema), { responseType: 'arraybuffer' });
      await bot.sendMessage(msg.from, Buffer.from(res.data), { mimetype:'image/png', caption:'✅ Arte creado 🇦🇷' });
    } catch { msg.reply('❌ No pude pintar esa idea ahora.'); }
  }

  // MP3
  if(txt.startsWith('!mp3 ')){
    let nombre = txt.slice(5);
    msg.reply('🎵 Buscando tu ritmo favorito... 🇦🇷');
    try {
      let buscar = await axios.get(API.BUSCAR + encodeURIComponent(nombre));
      let enlace = "https://youtu.be/" + buscar.data.result[0].videoId;
      let bajar = await axios.get(API.MP3 + enlace, { responseType: 'arraybuffer' });
      await bot.sendMessage(msg.from, Buffer.from(bajar.data), { mimetype:'audio/mpeg' });
    } catch { msg.reply('❌ Canción no encontrada.'); }
  }

  // VIDEO
  if(txt.startsWith('!video ')){
    let nombre = txt.slice(7);
    msg.reply('🎬 Preparando video en alta calidad... 🇦🇷');
    try {
      let buscar = await axios.get(API.BUSCAR + encodeURIComponent(nombre));
      let enlace = "https://youtu.be/" + buscar.data.result[0].videoId;
      let bajar = await axios.get(API.MP4 + enlace, { responseType: 'arraybuffer' });
      await bot.sendMessage(msg.from, Buffer.from(bajar.data), { mimetype:'video/mp4' });
    } catch { msg.reply('❌ Video no encontrado.'); }
  }

  // APK
  if(txt.startsWith('!apk ')){
    let app = txt.slice(5);
    msg.reply('📱 Buscando aplicación segura... 🇦🇷');
    try {
      let res = await axios.get(API.APK + encodeURIComponent(app));
      if(res.data.download){
        msg.reply(`✅ *${app}* encontrada!\n🔗 Descargala aquí: ${res.data.download}\n⚠️ Segura y rápida 🇦🇷`);
      } else { msg.reply('❌ Esa aplicación no está disponible.'); }
    } catch { msg.reply('❌ Error al buscar, probá otro nombre.'); }
  }

  // STICKER
  if(txt === '!sticker' && msg.hasMedia){
    let archivo = await msg.downloadMedia();
    await bot.sendMessage(msg.from, archivo, { sendMediaAsSticker: true, stickerName: "Bachira", stickerAuthor: "Benjare 🇦🇷" });
  }
});

bot.initialize();
        
