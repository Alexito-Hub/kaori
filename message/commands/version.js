const axios = require('axios');

module.exports = {
    name: 'version',
    description: 'Muestra la última versión del repositorio',
    aliases: ['version', 'v'],

    async execute(sock, m) {
        try {
            const repoOwner = 'Alexito-Hub'
            const repoName = 'Kaori'

            const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`);

            const latestVersion = response.data.tag_name;
            const releaseNotes = response.data.body;

            await sock.sendMessage(m.chat, { text:`Nueva versión: ${latestVersion}
Notas de la versión:
${releaseNotes}`}, { quoted: m });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, {text:'Parece que hubo un error'}, { quoted: m });
        }
    }
}
