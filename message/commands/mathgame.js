const { randomInt } = require('../../lib/utils');

module.exports = {
    name: 'mathgame',
    description: 'Juego de matemáticas: responde preguntas de suma y resta',
    aliases: ['mathgame', 'juegomatematico'],

    async execute(sock, m) {
        try {
            // Genera dos números aleatorios para la pregunta
            const num1 = getRandomInt(1, 100);
            const num2 = getRandomInt(1, 100);

            // Decide si la pregunta será de suma o resta
            const isAddition = Math.random() < 0.5;
            const operator = isAddition ? '+' : '-';

            // Calcula la respuesta correcta
            const correctAnswer = isAddition ? num1 + num2 : num1 - num2;

            // Construye el mensaje de la pregunta
            const questionMessage = `¡Hola! Responde la siguiente pregunta:\n\n${num1} ${operator} ${num2} = ?`;

            // Utiliza m.reply para enviar la pregunta al remitente
            await sock.sendMessage(m.chat, { text: questionMessage }, { quoted: m });

            // Espera la respuesta del usuario
            const response = await sock.waitForMessage({ sender: m.sender, quoted: m });

            // Verifica si la respuesta es correcta
            if (response && parseInt(response.text) === correctAnswer) {
                // Respuesta correcta
                await sock.sendMessage(m.chat, { text: `¡Correcto! 🎉 La respuesta es ${correctAnswer}.`}, { quoted: response });
            } else {
                // Respuesta incorrecta
                await sock.sendMessage(m.chat, { text:`Incorrecto 😟 La respuesta correcta es ${correctAnswer}.`}, { quoted: response });
            }
        } catch (error) {
            console.error('Error en la ejecución del comando mathgame:', error);
        }
    }
};
