const { SlashCommandBuilder } = require('@discordjs/builders');

// WARNING: this is very dangerous, can be used to execute arbitrary code
module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('Calculate a math expression')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('The expression to calculate')
                .setRequired(true)
        ),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        await interaction.deferReply({
            ephemeral: false,
        });

        try {
            var result = eval(expression);
            interaction.editReply(`${expression} = ${result}`);
        } catch (e) {
            interaction.editReply(`undefined expression: ${expression}`);
            console.log(e);
        }
    }
}