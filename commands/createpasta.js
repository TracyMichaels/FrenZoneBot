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

        // convert name to single lowercase word
        pastaName = pastaName.toLowerCase().replace(' ', '');

        // Check if pasta name is valid
        if (pastaName.length > 25) {
            await interaction.reply({
                cpntent: 'Pasta name is too long, must be < 25 characters',
                ephemeral: true
            });
            return;
        }

        // Check if pasta name is already taken
        var pastaNameExists = false;
        fs.readdirSync('./pastas').forEach(pasta => { 
            if (pasta.replace('.txt', '').toLowerCase() === pastaName) {
                pastaNameExists = true;
            }
        });

        if (pastaNameExists) {
            await interaction.reply({
                content: 'Pasta name is already taken',
                ephemeral: true
            });
            return;
        }

        // Write pasta to file
        try {
            fs.writeFileSync(`./pastas/${pastaName}.txt`, pastaBody);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: 'Error writing pasta to file, action failed (common reasons: special characters in pasta name, pasta name is too long, pasta name is already taken)',
                ephemeral: true
            });
            return;
        }

        // Send response
        var message = `Successfully created pasta, ${pastaName}! \nallow time for the bot to update its list of pastas before use`;
        await interaction.reply({
            content: message,
        });
    }
};