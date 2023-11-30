const translate = require('translate-google');

module.exports = {
  name: 'traducir',
  description: 'Traduce un mensaje al idioma especificado.',
  async execute(sock, m, args) {
    try {
      const targetLanguage = args[0];
      const textToTranslate = m.quoted ? m.quoted.body : m.body;

      if (!targetLanguage || !textToTranslate) {
        sock.sendMessage(m.chat, 'Uso correcto: traducir <idioma> <texto>', { quoted: m });
        return;
      }

      const translation = await translate(textToTranslate, { to: targetLanguage });
      sock.sendMessage(m.chat, `Traducción (${targetLanguage}):\n${translation.text}`, { quoted: m });
    } catch (error) {
      console.error(error);
      const errorMessage = error.message || 'Error al traducir. Intenta de nuevo más tarde.';
      sock.sendMessage(m.chat, errorMessage, { quoted: m });
    }
  },
};
