module.exports = {
    name: 'calculadora',
    description: 'Una calculadora simple y eficaz',
    aliases: ['cal', 'calculadora', 'math'],
    
    async execute(sock, m) {
        const mathExpression = body.slice(body.indexOf(' ') + 1).trim();
        try {
            const result = parser.evaluate(mathExpression);
            sock.sendMessage(m.chat, { text:`🔢 *Operación matemática:*\n${mathExpression}\n🎯 *Resultado:*\n${result}`},{quoted:m})
            } catch (error) {
            sock.sendMessage(m.chat, {text:`*Uso correcto: <comando> <operación matemática>*

*Ejemplo:*

 => math 5 + 3
 => math 10 * 2
 => math (8 - 3) * 4

*Tambien se puede usar:* mat, mate.`}, {quoted:m})
            }
    }
}