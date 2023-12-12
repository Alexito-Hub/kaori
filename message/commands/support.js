const fs = require('fs');
const path = require('path');
require('../../config');

const ticketsFile = path.join(__dirname, 'tickets.json');
let tickets = [];

if (fs.existsSync(ticketsFile)) {
    tickets = JSON.parse(fs.readFileSync(ticketsFile, 'utf8'));
}

module.exports = {
    name: 'support',
    description: 'Envía un mensaje de soporte al propietario del bot',
    
    async execute(sock, m, args) {
        try {
            const isOwner = owner + '@s.whatsapp.net';
            const user = m.sender.split('@')[0];
            const supportMessage = args.join(' ');

            const ticket = {
                user,
                message: supportMessage,
                date: new Date().toLocaleString(),
                closed: false,
            };

            tickets.push(ticket);

            fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));

            // Enviar mensaje de confirmación con emoji 🎫
            const confirmationMessage = `Está a punto de crear un ticket\nRazón: ${supportMessage}\n\nPara continuar reaccione al mensaje con "🎫" o responde al mensaje con ticket`;
            const confirmationResponse = await sock.sendMessage(m.chat, { text: confirmationMessage });

            // Agregar reacción al mensaje de confirmación
            await sock.messageReactions(confirmationResponse.key, '🎫');

            // Esperar a que los usuarios reaccionen
            const reactionTimeout = 60000; // 60 segundos
            const reactions = await sock.getReactions(confirmationResponse.key, reactionTimeout);

            // Verificar si alguien reaccionó con 🎫
            const ticketReactions = reactions.filter(reaction => reaction.emoji === '🎫');

            if (ticketReactions.length > 0) {
                // Enviar mensaje al propietario
                await sock.sendMessage(isOwner, { text: `Nuevo ticket de soporte de ${user}:\n\n${supportMessage}` });
                await sock.sendMessage(m.chat, { text: 'Tu mensaje de soporte ha sido enviado. El propietario revisará tu solicitud.' });
            } else {
                // Nadie reaccionó, informar al usuario
                await sock.sendMessage(m.chat, { text: 'Nadie reaccionó al mensaje de confirmación con 🎫. El ticket no ha sido procesado.' });
            }

        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al procesar la solicitud de soporte.' });
        }
    },
};
