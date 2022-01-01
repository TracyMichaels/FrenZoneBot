const { SlashCommandBuilder } = require('@discordjs/builders');

// rolls a dice
module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a dice')
        .addIntegerOption(option =>
            option.setName('numdice')
                .setDescription('Number of dice to roll (Default: 1)')
        )
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('Number of sides on the dice (Default: 6)')
        )
        .addIntegerOption(option =>
            option.setName('mod')
                .setDescription('Modifier to add to the roll (Default: 0)')
        ),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true,
        });

        // parse options
        const numDice = interaction.options.getInteger('numdice') || 1;
        const numSides = interaction.options.getInteger('sides') || 6;
        const modifier = interaction.options.getInteger('mod') || 0;

        // roll dice
        let total = 0;
        for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * numSides) + 1;
        }

        // add modifier
        total += modifier;

        // send result
        await interaction.editReply(`You rolled a ${total}!`);
    }
};