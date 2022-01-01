const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Display info about yourself.'),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        // await new Promise(resolve => setTimeout(resolve, 10000));

        return interaction.editReply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
    },
};