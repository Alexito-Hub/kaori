const math = require('mathjs');

module.exports = {
    name: 'calculadora',
    description: 'Una calculadora completa',
    aliases: ['cal', 'calculadora', 'math'],
    
    async execute(sock, m) {
        const input = m.body.slice(m.body.indexOf(' ') + 1).trim();
        
        try {
            const result = math.evaluate(input);
            sock.sendMessage(m.chat, { text:`Resultado: ${result}`}, { quoted: m });
        } catch (error) {
            sock.sendMessage(m.chat, { text:`*<cal <expresión matemática>>*`}, { quoted: m });
        }
    }
}