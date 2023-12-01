const { evaluate } = require('mathjs');

module.exports = {
    name: 'mathgame',
    description: '¡Desafía tu mente con un juego matemático!',
    aliases: ['juego', 'mathchallenge'],
    
    async execute(sock, m) {
        const difficultyLevels = ['fácil', 'normal', 'difícil', 'experto'];
        const difficulty = difficultyLevels.includes(m.body.toLowerCase()) ? m.body.toLowerCase() : 'normal';

        const num1 = generateRandomNumber(difficulty);
        const num2 = generateRandomNumber(difficulty);
        const operator = generateRandomOperator(difficulty);
        const expression = `${num1} ${operator} ${num2}`;

        let correctAnswer;
        try {
            correctAnswer = evaluate(expression);
        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, 'Hubo un error al generar la pregunta. Inténtalo de nuevo.', { quoted: m });
            return;
        }

        try {
            // Envía la pregunta al usuario con un temporizador de 30 segundos
            await sock.sendMessage(m.chat, {
                text: `⏳ *Desafío Matemático - Nivel ${difficulty.toUpperCase()}* ⏳\n\nResuelve la siguiente operación en 30 segundos:\n*${expression}*`,
                contextInfo: { mentionedJid: [m.sender] }
            });

            // Espera la respuesta del usuario durante 30 segundos
            const userResponse = await sock.waitForMessage(m.from, { sender: m.sender, timeout: 30000 });

            // Verifica si el usuario respondió a tiempo
            if (userResponse) {
                const userAnswer = parseFloat(userResponse.body.trim());

                // Verifica la respuesta del usuario
                if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
                    await sock.sendMessage(m.chat, `🎉 ¡Correcto! La respuesta es ${correctAnswer}. ¡Bien hecho!`, { quoted: m });
                } else {
                    await sock.sendMessage(m.chat, `❌ Incorrecto. La respuesta correcta era ${correctAnswer}. ¡Inténtalo de nuevo!`, { quoted: m });
                }
            } else {
                // El usuario no respondió a tiempo
                await sock.sendMessage(m.chat, '⌛ ¡Se acabó el tiempo! Inténtalo de nuevo.', { quoted: m });
            }
        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, 'Hubo un error al procesar el juego. Inténtalo nuevamente más tarde.', { quoted: m });
        }
    }
};

function generateRandomNumber(difficulty) {
    const difficultyFactors = {
        fácil: 10,
        normal: 50,
        difícil: 100,
        experto: 500
    };

    return Math.floor(Math.random() * difficultyFactors[difficulty]) + 1;
}

function generateRandomOperator(difficulty) {
    const basicOperators = ['+', '-'];
    const advancedOperators = ['*', '/'];

    if (difficulty === 'experto') {
        return advancedOperators[Math.floor(Math.random() * advancedOperators.length)];
    }

    return basicOperators[Math.floor(Math.random() * basicOperators.length)];
}
