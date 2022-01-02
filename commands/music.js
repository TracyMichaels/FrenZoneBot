const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('music commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('play a song (enter a youtube link, or search for a song)')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('the url of the song to play')
                )
                .addStringOption(option =>
                    option
                        .setName('search')
                        .setDescription('song title or band to search for')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('pause the current song')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('resume')
                .setDescription('resume the current song')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('stop the current song')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('skip the current song')
        ),
    async execute(interaction) {
        const musicQueue = new Map();
        await interaction.deferReply({
            ephemeral: false,
        });

        interaction.editReply({
            content: 'command currently not implemented',
        });
    }
}