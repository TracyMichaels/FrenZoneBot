const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Display info about this server.'),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: false,
        });
        return interaction.editReply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    },
};