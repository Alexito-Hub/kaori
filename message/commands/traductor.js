const translate = require('translate-google');

module.exports = {
  name: 'traducir',
  description: 'Traduce un mensaje al idioma especificado.',
  async execute(sock, m, args) {
    try {
      const targetLanguage = args[0];
      const textToTranslate = m.quoted ? m.quoted.body : m.body;

      if (!targetLanguage || !textToTranslate) {
        sock.sendMessage(m.chat, {title:'Uso correcto: traducir <idioma> <texto>'}, { quoted: m });
        return;
      }

      const translation = await translate(textToTranslate, { to: targetLanguage });
      sock.sendMessage(m.chat, {title:`Traducción (${targetLanguage}):\n${translation.text}`}, { quoted: m });
    } catch (error) {
      console.log(error);
      sock.sendMessage(m.chat, {text:`${error}`}, { quoted: m });
    }
  },
};
