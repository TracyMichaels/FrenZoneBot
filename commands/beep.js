const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beep')
        .setDescription('Beep!'),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: false,
        });
        return interaction.editReply('Boop!');
    },
};