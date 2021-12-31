const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

var pastas = ["daddy", "familyguy", "linux", "navyseal", "rickmorty"];



module.exports = {
    data: new SlashCommandBuilder()
        .setName('pasta')
        .setDescription('Display or create(coming soon) a copy pasta')
        .addStringOption(option => {
            option.setName('name')
                .setDescription('The pasta to display')
                .setRequired(true);
                
            for(var i = 0; i<pastas.length; i++) {
                option.addChoice(pastas[i], pastas[i]);
            }
            return option;
        }),

    async execute(interaction) {
        var pasta = interaction.options.getString('name');
        await interaction.reply(`${fs.readFileSync(`./pastas/${pasta}.txt`)}`);
    }
}