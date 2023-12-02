const { randomInt } = require('../../lib/utils');

module.exports = {
    name: 'mathgame',
    description: 'Juego de matemáticas: responde preguntas de suma y resta',
    aliases: ['mathgame', 'juegomatematico'],

    async execute(sock, m) {
        try {
            const num1 = randomInt(1, 100);
            const num2 = randomInt(1, 100);

            const isAddition = Math.random() < 0.5;
            const operator = isAddition ? '+' : '-';

            const correctAnswer = isAddition ? num1 + num2 : num1 - num2;

            const questionMessage = `¡Hola! Responde la siguiente pregunta:\n\n${num1} ${operator} ${num2} = ?`;

            sock.sendMessage(m.chat, { text: questionMessage }, { quoted: m });
            
            const response = sock.waitForMessage({ sender: m.sender, quoted: m });
            if (response && parseInt(response.text) === correctAnswer) {
                sock.sendMessage(m.chat, { text: `¡Correcto! 🎉 La respuesta es ${correctAnswer}.`}, { quoted: response });
            } else {
                sock.sendMessage(m.chat, { text:`Incorrecto 😟 La respuesta correcta es ${correctAnswer}.`}, { quoted: response });
            }
        } catch (error) {
            v.reply(`Error ${error}`)
            console.error('Error en la ejecución del comando mathgame:', error);
        }
    }
};
