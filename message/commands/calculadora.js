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
            sock.sendMessage(m.chat, { text:`*Uso correcto de la calculadora*
            
*Álgebra:* cal solve('2x - 4 = 0')
*Uso básico:* cal 5 + 3
*Números grandes:* cal pow(10, 20)
*Encadenamiento:* cal 2 + 3 * 4
*Números complejos:* cal sqrt(-1)
*Expresiones:* cal pow(2, 3) + sqrt(16)
*Fracciones:* cal 1/3 + 1/4

Recuerda: si no tienes conocimientos, no lo uses`}, { quoted: m });
        }
    }
}