const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question of the poll')
                .setRequired(true)
        ),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const answer1 = interaction.options.getString('answer1');
        const answer2 = interaction.options.getString('answer2');

        await interaction.deferReply({
            ephemeral: false,
        });

        const embed = new MessageEmbed()
            .setTitle(question)
            .setColor(0x00AE86)
            .setDescription('React with the emojis to vote')
            .addFields(
                { name: '✅', value: 'yes', inline: true },
                { name: '❌', value: 'no', inline: true }
            )
            .setTimestamp(new Date())
            .setFooter(`Poll created by ${interaction.user.username}`);

        const message = await interaction.editReply({
            embeds: [embed]
        });

        message.react('✅');
        message.react('❌');





    }
}