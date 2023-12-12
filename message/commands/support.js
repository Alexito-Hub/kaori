const tickets = [];

module.exports = {
    name: 'support',
    description: 'Crea un ticket de soporte',
    
    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                await sock.sendMessage(m.chat, { text: '*support <razón>*' }, { quoted: m });
                return;
            }

            const user = m.sender.split('@')[0];
            const reason = args.join(' ');

            // Crear mensaje para la creación del ticket
            const ticketCreationMsg = `-- Support --
"Está a punto de crear un ticket
Razón: ${reason}

Para continuar reaccione al mensaje con 🎫 o responda con ticket."`;

            // Enviar mensaje para la creación del ticket
            await sock.sendMessage(m.chat, {text:ticketCreationMsg}, { quoted: m });

            // Esperar reacción al mensaje o respuesta con "ticket"
            const response = await sock.waitForMessage(m.chat, m.key, 60000);
            
            if (response) {
                // Verificar si la respuesta es una reacción con "🎫"
                if (response.message && response.message.ephemeralMessage && response.message.ephemeralMessage.message) {
                    const reactionText = response.message.ephemeralMessage.message.text;

                    if (reactionText.includes('🎫')) {
                        // Crear y procesar el ticket
                        const ticketNumber = tickets.length + 1;
                        const currentDate = new Date().toLocaleString();

                        tickets.push({
                            number: ticketNumber,
                            user,
                            reason,
                            date: currentDate,
                        });

                        // Notificar la creación del ticket
                        const ticketCreationConfirmation = `-- Support --
Su ticket fue creado @${user}
Razón: ${reason} 
Fecha: ${currentDate}

Se envió mensaje a soporte`;

                        await sock.sendMessage(m.chat, {text:ticketCreationConfirmation}, { quoted: m });

                        // Enviar mensaje al grupo de soporte
                        const supportGroupMsg = `-- Support --
Se abrió un ticket de soporte por @${user}
Razón: ${reason}
Fecha: ${currentDate}
Número de proceso: ${ticketNumber}

Grupo de soporte:
Envía mensaje al grupo de soporte con "ticket ${ticketNumber} <razón> --closed" para cerrar el ticket.`;

                        await sock.sendMessage('120363185594383861@g.us', {text:supportGroupMsg});

                    } else {
                        await sock.sendMessage(m.chat, { text: 'Respuesta no válida. Utilice 🎫 o responda con "ticket" para continuar.' }, { quoted: m });
                    }
                } else if (response.message && response.message.text && response.message.text.toLowerCase() === 'ticket') {
                    // Crear y procesar el ticket si el usuario responde con "ticket"
                    const ticketNumber = tickets.length + 1;
                    const currentDate = new Date().toLocaleString();

                    tickets.push({
                        number: ticketNumber,
                        user,
                        reason,
                        date: currentDate,
                    });

                    // Notificar la creación del ticket
                    const ticketCreationConfirmation = `-- Support --
Su ticket fue creado @${user}
Razón: ${reason} 
Fecha: ${currentDate}

Se envió mensaje a soporte`;

                    await sock.sendMessage(m.chat, {text:ticketCreationConfirmation}, { quoted: m });

                    // Enviar mensaje al grupo de soporte
                    const supportGroupMsg = `-- Support --
Se abrió un ticket de soporte por @${user}
Razón: ${reason}
Fecha: ${currentDate}
Número de proceso: ${ticketNumber}

Grupo de soporte:
Envía mensaje al grupo de soporte con "ticket ${ticketNumber} <razón> --closed" para cerrar el ticket.`;

                    await sock.sendMessage('120363185594383861@g.us', {text:supportGroupMsg});

                } else {
                    await sock.sendMessage(m.chat, { text: 'Respuesta no válida. Utilice 🎫 o responda con "ticket" para continuar.' }, { quoted: m });
                }
            } else {
                await sock.sendMessage(m.chat, { text: 'Tiempo de espera agotado. La creación del ticket se canceló.' }, { quoted: m });
            }

        } catch (e) {
            console.error('Error:', e);
            await sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando' }, { quoted: m });
        }
    },
};
