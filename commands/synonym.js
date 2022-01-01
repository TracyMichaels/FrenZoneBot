const { SlashCommandBuilder } = require('@discordjs/builders');
const synonyms = require('synonyms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('synonym')
        .setDescription('Get synonyms of a word')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to get synonyms of')
                .setRequired(true)
        ),
    async execute(interaction) {
        const word = interaction.options.getString('word');

        await interaction.deferReply({
            ephemeral: false,
        });

        var nouns = synonyms(word, 'n');
        var verbs = synonyms(word, 'v');

        var msgContents = `input: **${word}**\n\n__Synonms:__\nnouns: ${(nouns != undefined) ? nouns.join(', ') : '(undefined)'}\nverbs: ${(verbs != undefined) ? verbs.join(', ') : '(undefined)'}`;

        await interaction.editReply(msgContents);
    }
}