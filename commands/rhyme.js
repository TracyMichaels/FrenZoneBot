const { SlashCommandBuilder } = require('@discordjs/builders');
const rhyme = require('rhyme');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rhyme')
        .setDescription('Rhyme a word')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to rhyme')
                .setRequired(true)
        ),
    async execute(interaction) {
        const word = interaction.options.getString('word');

        await interaction.deferReply({
            ephemeral: false,
        });

        rhyme(function (r) {
            var rhymes = r.rhyme(word).join(', ').toLowerCase();
            if (rhymes.length > 0) {                 
                interaction.editReply({
                    content: `input: **${word}**\n\n__rhymes:__\n${rhymes}`,
                });
            } else {
                interaction.editReply("No rhymes found");
            }
        });
    }    
}

