const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

module.exports = {
  name: 'traducir',
  description: 'Traduce un mensaje al idioma especificado.',
  execute: async (sock, m, args) => {
    try {
      const targetLanguage = args[0];
      const textToTranslate = m.quoted ? m.quoted.body : m.body;

      if (!targetLanguage || !textToTranslate) {
        sock.sendMessage(m.chat, 'Uso correcto: traducir <idioma> <texto>', { quoted: m });
        return;
      }

      const [translation] = await translate.translate(textToTranslate, targetLanguage);
      sock.sendMessage(m.chat, {text:`Traducción (${targetLanguage}):\n${translation}`}, { quoted: m });
    } catch (error) {
      sock.sendMessage(m.chat, {text:`No se pudo traducir ${error}`}, { quoted: m });
    }
  },
};
