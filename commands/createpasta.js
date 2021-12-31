const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ephemeral } = require('synonyms/dictionary');

// Get number of current pastas
var numPastas = fs.readdirSync('./pastas', (err, files) => {
    if (err) return console.error(err);
    return files;
}).length;

// console.log(numPastas);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createpasta')
        .setDescription(`Create a copy pasta (${25 - numPastas} slots left)`)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('(WARNING: will be converted to a single lowercase word)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('body')
                .setDescription('The body of the pasta')
                .setRequired(true)
        ),
    async execute(interaction) {
        var pastaName = interaction.options.getString('name');
        var pastaBody = interaction.options.getString('body');

        // Check if pasta name is valid
        if (pastaName.length > 25) {
            await interaction.reply({
                cpntent: 'Pasta name is too long, must be > 25 characters',
                ephemeral: true
            });
            return;
        }

        // Check if pasta name is already taken
        var pastaNameLower = pastaName.toLowerCase();
        var pastaNameExists = false;
        for (var i = 0; i < numPastas; i++) {
            if (pastaNameLower == fs.readdirSync('./pastas')[i].replace('.txt', '').toLowerCase()) {
                pastaNameExists = true;
                break;
            }
        }

        if (pastaNameExists) {
            await interaction.reply({
                content: 'Pasta name is already taken',
                ephemeral: true
            });
            return;
        }

        // Write pasta to file
        fs.writeFileSync(`./pastas/${pastaNameLower}.txt`, pastaBody);

        // Send response
        await interaction.reply({
            content: `Created pasta ${pastaNameLower}`,
        });
    }
};