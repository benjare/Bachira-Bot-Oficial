# 📁 CREACIÓN RÁPIDA • PEGÁ Y LISTO
rm -rf Bachira-Bot-Oficial
mkdir Bachira-Bot-Oficial
cd Bachira-Bot-Oficial

# 📄 package.json
cat > package.json << 'EOF'
{
  "name": "bachira-bot-oficial",
  "version": "1.3.0",
  "description": "Bot WhatsApp • CONEXIÓN POR NÚMERO • Foto Bachira incluida • Benjare 🇦🇷",
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

# 📄 index.js • TODO AQUÍ • CONECTA SOLO POR NÚMERO
cat > index.js << 'EOF'
require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

// 📸 FOTO OFICIAL DE BACHIRA INCLUIDA
const FOTO_BACHIRA = "https://i.pinimg.com/564x/d2/cb/1e/d2cb1e09d1367799008294c4d1814562.jpg";

// ✅ APIs
const API = {
  GPT: "https://api.siputzx.my.id/api/ai/gpt4?text=",
  IMAGEN: "https://api.siputzx.my.id/api/ai/dalle?prompt=",
  BUSCAR: "https://api.siputzx.my.id/api/ytsearch?q=",
  MP3: "https://api.siputzx.my.id/api/ytdl/mp3?url=",
  MP4: "https://api.siputzx.my.id/api/ytdl/mp4?url=",
  APK: "https://api.siputzx.my.id/api/apk/search?q="
};

// 🔑 CONEXIÓN POR NÚMERO (SIN QR)
const bot = new Client({
  authStrategy: new LocalAuth(),
  pairWithPhoneNumber: {
    phoneNumber: "549XXXXXXXXXX", // ⚠️ PONÉ TU NÚMERO AQUÍ: código país 54 + 9 + tu número
    showNotification: true,
    intervalMs: 180000
  },
  puppeteer: { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }
});

// 📋 CUANDO SALGA EL CÓDIGO DE 8 DÍGITOS
bot.on('code', codigo => {
  console.log(`\n🔑 TU CÓDIGO DE CONEXIÓN: ${codigo}`);
  console.log("📱 EN TU CELULAR: WhatsApp > Dispositivos vinculados > Vincular con número > Ingresá ESTE CÓDIGO\n");
});

bot.on('ready', async () => {
  console.log('\n✅ BACHIRA BOT • 100% ACTIVO 🇦🇷');
  console.log('👤 Creado por: Benjare | Argentina ⚽\n');
  // PONE FOTO DE PERFIL AUTOMÁTICA
  try {
    const foto = await MessageMedia.fromUrl(FOTO_BACHIRA);
    await bot.setProfilePicture(foto);
    console.log('✅ Foto de Bachira colocada correctamente 🟡');
  } catch { console.log('⚠️ Foto lista para menú, perfil se actualiza rápido'); }
});

// 📄 MENÚ CON LA IMAGEN
const MENU = `🟡⚡ **BACHIRA - BOT OFICIAL** ⚽

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

  if(['hola','bachira','menu','ayuda','comandos'].includes(txt)) {
    const img = await MessageMedia.fromUrl(FOTO_BACHIRA);
    return msg.reply(img, { caption: MENU });
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

# 🚀 INSTALACIÓN Y ARRANQUE
npm install
echo "⚠️ ANTES DE INICIAR: Edita index.js y pon tu número en la línea: phoneNumber: \"549XXXXXXXXXX\""
  
