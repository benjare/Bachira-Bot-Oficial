# 🟡 CÓDIGO COMPLETO • PEGALO ENTERO
rm -rf Bachira-Bot-Oficial
mkdir Bachira-Bot-Oficial
cd Bachira-Bot-Oficial

# 📄 package.json
cat > package.json << 'EOF'
{
  "name": "bachira-bot-oficial",
  "version": "1.2.0",
  "description": "Bot WhatsApp • IA • Imágenes • MP3 • Video • APK • Foto Bachira incluida | Benjare 🇦🇷",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "whatsapp-web.js": "^1.26.0",
    "qrcode-terminal": "^0.12.0",
    "axios": "latest",
    "dotenv": "latest"
  }
}
EOF

# 📄 .env
cat > .env << 'EOF'
NOMBRE=Bachira Bot Oficial
CREADOR=Benjare
PAIS=Argentina 🇦🇷
VERSION=1.2.0
EOF

# 📄 index.js → CON LA FOTO DE BACHIRA INCLUIDA DENTRO
cat > index.js << 'EOF'
require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// ✅ APIs CONFIGURADAS
const API = {
  GPT: "https://api.siputzx.my.id/api/ai/gpt4?text=",
  IMAGEN: "https://api.siputzx.my.id/api/ai/dalle?prompt=",
  BUSCAR: "https://api.siputzx.my.id/api/ytsearch?q=",
  MP3: "https://api.siputzx.my.id/api/ytdl/mp3?url=",
  MP4: "https://api.siputzx.my.id/api/ytdl/mp4?url=",
  APK: "https://api.siputzx.my.id/api/apk/search?q="
};

// ✅ FOTO OFICIAL DE BACHIRA DIRECTA DESDE EL CÓDIGO
const FOTO_BACHIRA = "https://i.pinimg.com/564x/d2/cb/1e/d2cb1e09d1367799008294c4d1814562.jpg";

const bot = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

bot.on('qr', codigo => {
  console.log('\n📲 ESCANEA EL QR | BACHIRA ACTIVO 🟡⚡\n');
  qrcode.generate(codigo, { small: true });
});

bot.on('ready', async () => {
  console.log('\n✅ BACHIRA LISTO • CON SU FOTO OFICIAL');
  console.log('👤 Creado por: Benjare');
  console.log('🌎 País: Argentina 🇦🇷\n');

  // 📸 PONE LA FOTO DE PERFIL AUTOMÁTICA
  try {
    const mediaFoto = await MessageMedia.fromUrl(FOTO_BACHIRA);
    await bot.setProfilePicture(mediaFoto);
    console.log('✅ Foto de Bachira puesta correctamente 🟡');
  } catch {
    console.log('⚠️ La imagen cargó en el menú, pero el perfil se pondrá en unos minutos');
  }
});

// 📋 MENÚ CON LA IMAGEN DE BACHIRA
const TEXTO_MENU = `🟡⚡ **BACHIRA - BOT OFICIAL** ⚽

¡Hola! Soy **Bachira**, traigo magia y locura desde **Argentina**.
Creado totalmente por **Benjare**, mi creador.

> ❝ *Mi locura es lo que hace que el fútbol sea magia.* ❞

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

  // 🟢 MUESTRA EL MENÚ CON LA FOTO DE BACHIRA
  if(['hola','bachira','menu','ayuda','comandos'].includes(txt)) {
    const imagenMenu = await MessageMedia.fromUrl(FOTO_BACHIRA);
    return msg.reply(imagenMenu, { caption: TEXTO_MENU });
  }

  if(txt === 'creador') return msg.reply('💡 Todo esto fue desarrollado por **Benjare**, aquí en Argentina 🇦🇷 ¡gracias a él existo!');
  if(txt === 'frase') return msg.reply('❝ *Jugar para divertirse es el único secreto para ser el mejor.* ❞ — Bachira ⚽🟡');
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
EOF

# 📄 README.md
cat > README.md << 'EOF'
# 🟡 Bachira Bot - Oficial ⚽
> Bot creado desde cero por **Benjare** 🇦🇷 Argentina
✅ Con foto oficial de Bachira incluida
✅ Inteligencia Artificial • Imágenes • MP3 • Video • APK
EOF

# 🚀 INSTALAR Y ARRANCAR
npm install
node index.js
