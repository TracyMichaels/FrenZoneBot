const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

var pastas = fs.readdirSync('./pastas', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        pastas.push(file);
    });
});

for (let i = 0; i < pastas.length; i++) {
    pastas[i] = pastas[i].replace('.txt', '');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pasta')
        .setDescription('Display a copy pasta')
        .addStringOption(option => {
            option.setName('name')
                .setDescription('The pasta to display')
                .setRequired(true);

            for (var i = 0; i < pastas.length; i++) {
                option.addChoice(pastas[i], pastas[i]);
            }
            return option;
        }),

    async execute(interaction) {
        var pasta = interaction.options.getString('name');

        await interaction.deferReply({
            ephemeral: true,
        });
        
        await interaction.editReply(`${fs.readFileSync(`./pastas/${pasta}.txt`)}`);
    }
}