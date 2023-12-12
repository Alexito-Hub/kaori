const fs = require('fs');
const path = require('path');
require('../../config'); // Asegúrate de tener la referencia adecuada al archivo de configuración

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
            const user = m.sender.split('@')[0];
            const supportMessage = args.join(' ');

            // Crear mensaje de confirmación
            const confirmationResponse = await sock.sendMessage(m.chat, {
                text: `Está a punto de crear un ticket\n\nRazón: ${supportMessage}\n\nPara continuar reaccione al mensaje con "🎫" o responde al mensaje con "ticket"`,
            });

            // Obtener el ID del mensaje de confirmación
            const confirmationMsgID = confirmationResponse.key.id;

            // Esperar 30 segundos antes de verificar las reacciones
            setTimeout(async () => {
                // Verificar si existe sock.messageReactions y tiene la propiedad confirmationMsgID
                if (sock.messageReactions && sock.messageReactions[confirmationMsgID]) {
                    const reactions = sock.messageReactions[confirmationMsgID].reactions || [];

                    // Filtrar las reacciones que tienen el emoji 🎫
                    const ticketReactions = reactions.filter(reaction => reaction.emoji === '✅');

                    // Si hay al menos una reacción con 🎫
                    if (ticketReactions.length > 0) {
                        const userID = ticketReactions[0].jid.split('@')[0];

                        const ticket = {
                            user,
                            userID,
                            message: supportMessage,
                            date: new Date().toLocaleString(),
                            closed: false,
                        };

                        tickets.push(ticket);

                        // Enviar mensaje de ticket al propietario del bot
                        await sock.sendMessage(owner + '@s.whatsapp.net', { text: `Nuevo ticket de soporte de ${user}:\n\n${supportMessage}` });

                        // Enviar mensaje de confirmación al usuario que reaccionó
                        await sock.sendMessage(userID, { text: 'Tu mensaje de soporte ha sido enviado. El propietario revisará tu solicitud.' });

                        // Guardar los tickets en el archivo
                        fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
                    }
                }
            }, 30000); // 30 segundos de espera
        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al procesar la solicitud de soporte.' });
        }
    },
};
