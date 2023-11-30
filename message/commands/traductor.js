const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

module.exports = {
  name: 'traducir',
  description: 'Traduce un mensaje al idioma especificado.',
  aliases: ['traducir', 'translate', 'tl'],
  async execute(sock, m, args) {
    try {
      const targetLanguage = args[0];
      const textToTranslate = m.quoted ? m.quoted.body : m.body;

      if (!targetLanguage || !textToTranslate) {
        sock.sendMessage(m.chat, { text:'Uso correcto: traducir <idioma> <texto>'}, { quoted: m });
        return;
      }

      translate.translate(textToTranslate, targetLanguage).then(([translation]) => {
        sock.sendMessage(m.chat, {text:`Traducción (${targetLanguage}):\n${translation}`}, { quoted: m });
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || 'Error al traducir. Intenta de nuevo más tarde.';
      sock.sendMessage(m.chat, {text:errorMessage}, { quoted: m });
    }
  },
};
