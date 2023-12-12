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
            const isOwner = owner.includes(m.sender.split('@')[0]);
            const supportMessage = args.join(' ');

            const ticket = {
                user,
                message: supportMessage,
                date: new Date().toLocaleString(),
                closed: false,
            };

            tickets.push(ticket);

            fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));

            // Enviar mensaje de ticket al propietario del bot
            await sock.sendMessage(isOwner,{text: `Nuevo ticket de soporte de ${user}:\n\n${supportMessage}`});

            await sock.sendMessage(m.chat, {text:'Tu mensaje de soporte ha sido enviado. El propietario revisará tu solicitud.'});
        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, {text:'Error al procesar la solicitud de soporte.'});
        }
    },
};
