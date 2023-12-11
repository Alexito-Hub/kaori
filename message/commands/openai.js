const axios = require('axios');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

module.exports = {
    name: 'ai',
    description: 'Genera texto con inteligencia artificial',
    aliases: ['artificialintelligence', 'chatbot'],

    async execute(sock, m, args) {
        try {
            const message = args.join(' ');

            if (!message) {
                sock.sendMessage(m.chat, { text: 'Por favor, proporciona un mensaje para la inteligencia artificial.' }, { quoted: m });
                return;
            }

            sock.sendMessage(m.chat, { text: 'Generando respuesta...' }, { quoted: m });

            const response = await generateAIResponse(message);

            // Añade lógica adicional según la respuesta de la IA si es necesario
            const reply = response.data.choices[0]?.text || 'No se recibió una respuesta válida de la IA.';
            
            // Espera un momento antes de enviar la respuesta para dar un efecto más natural
            await sleep(1500);
            sock.sendMessage(m.chat, { text: reply }, { quoted: m });

        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando de inteligencia artificial.' }, { quoted: m });
        }
    },
};

async function generateAIResponse(message) {
    const apiKey = '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'; // Reemplaza con tu clave de API de OpenAI
    const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    const requestBody = {
        prompt: message,
        max_tokens: 100,
        n: 1,
        stop: '\n',
    };

    return axios.post(apiUrl, requestBody, { headers });
}
