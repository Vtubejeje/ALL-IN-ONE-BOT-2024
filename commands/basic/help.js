const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const { serverConfigCollection } = require('../../mongodb');
const commandFolders = ['anime', 'basic', 'fun', 'moderation', 'utility', 'distube music', 'setups'];
const enabledCategories = config.categories;
const excessCommands = config.excessCommands;
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of commands'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {

            const serverId = interaction.guildId;
            let serverConfig;
            try {
                serverConfig = await serverConfigCollection.findOne({ serverId });
            } catch (err) {
                console.error('Error fetching server configuration from MongoDB:', err);
            }

          
            const serverPrefix = serverConfig && serverConfig.prefix ? serverConfig.prefix : config.prefix;

            const createSlashCommandPages = () => {
                const pages = [];

                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(enabledCategories).filter(category => enabledCategories[category]);
                const disabledCategoriesList = Object.keys(enabledCategories).filter(category => !enabledCategories[category]);

                
                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };
                
             
                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };
                
              
                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');
                
             
                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
           
                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
            
                const totalCommands = totalCommandFiles + totalExcessCommandFiles;
                

                pages.push({
                    title: 'Bot Info <:user:1315671228257927248>',
                    description: `Hello fellow user! Here is the new AIO ( all in one ) Discord bot. which have dozens of commands to discover the best side of your server, checkout yourself!`,
                    commands: [
                        `**<:fix:1314967630536380528> Gizzard Developer:** Vtube.satoru\n`+
                        `**<:connect:1314967566745342063> Invention Date** 9.12.2024\n`+
                        `**Total Servers:** ${totalServers}\n`+
                        `**Total Members:** ${totalMembers}\n`+
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n`+
                        `**Total Commands:** ${totalCommands}\n`,
                    ],
                    image: "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&",
                    color: "#3498db",
                    thumbnail: "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&",
                    author: {
                        name: 'Gizzard AIO',
                        iconURL: "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg",
                        url: "https://discord.gg/aTSPpZ6fhS"
                    }
                });

                const commandData = {};

                for (const folder of commandFolders) {

                    if (enabledCategories[folder]) { 
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../commands/${folder}`)).filter(file => file.endsWith('.js'));
                        commandData[folder] = commandFiles.map(file => {
                            const command = require(`../../commands/${folder}/${file}`);
                            return command.data.name;
                        });
                    }
                }

                for (const [category, commands] of Object.entries(commandData)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Both Slash commands and Prefix\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command}\`\``),
                        image: "",
                        color: "#3498db",
                        thumbnail: "",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            iconURL: "",
                            url: "https://discord.gg/xQF9f9yUEM"
                        }
                    };

                    switch (category) {
                        case 'anime':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#ff66cc";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'basic':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#99ccff";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'fun':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#ffcc00";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'moderation':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#00cc99";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'distube music':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'setups':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        default:
                            page.color = "#3498db"; // Set a default color if none matches
                            break;
                    }

                    pages.push(page);
                }

                return pages;
            };

            const createPrefixCommandPages = () => {

                const pages = [];
                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(enabledCategories).filter(category => enabledCategories[category]);
                const disabledCategoriesList = Object.keys(enabledCategories).filter(category => !enabledCategories[category]);

                
                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };
                
             
                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };
                
              
                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');
                
             
                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
           
                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
            
                const totalCommands = totalCommandFiles + totalExcessCommandFiles;
                pages.push({
                    title: 'Bot Info <:user:1315671228257927248>',
                    description: `Hello fellow user! Here is the new AIO ( all in one ) Discord bot. which have dozens of commands to discover the best side of your server, checkout yourself!`,
                    commands: [
                        `<:fix:1314967630536380528> Gizzard Developer:** Vtube.satoru\n`+
                        `**<:connect:1314967566745342063> Invention Date** 9.12.2024\n`+
                        `**Total Servers:** ${totalServers}\n`+
                        `**Total Members:** ${totalMembers}\n`+
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n`+
                        `**Total Commands:** ${totalCommands}\n`,
                    ],
                    image: "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&",
                    color: "#3498db",
                    thumbnail: "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&",
                    author: {
                        name: 'Gizzard AIO',
                        iconURL: "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg",
                        url: "https://discord.gg/aTSPpZ6fhS"
                    }
                });

                const prefixCommands = {};

                for (const [category, isEnabled] of Object.entries(excessCommands)) {
                    if (isEnabled) {
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../excesscommands/${category}`)).filter(file => file.endsWith('.js'));
                        prefixCommands[category] = commandFiles.map(file => {
                            const command = require(`../../excesscommands/${category}/${file}`);
                            return {
                                name: command.name,
                                description: command.description
                            };
                        });
                    }
                }

                for (const [category, commands] of Object.entries(prefixCommands)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Only Prefix commands with \`${serverPrefix}\`\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command.name}\`\``),
                        image: "",
                        color: "",
                        thumbnail: "",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            iconURL: "",
                            url: "https://discord.gg/xQF9f9yUEM"
                        }
                    };

                    switch (category) {
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#00cc99";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'other':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#ff6600";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'lavalink':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#ffcc00";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        case 'troll':
                            page.image = "https://cdn.discordapp.com/attachments/1314967275530485763/1315669911032561674/how-to-make-a-discord-bot.png?ex=67584096&is=6756ef16&hm=2f039fcd413b92d78e8c9244ded443c2327beaff8cc01b75d5a83effb1855bdd&";
                            page.color = "#cc0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670811952287754/Music_Letter_G_Logo___BrandCrowd_Logo_Maker___BrandCrowd_Mozilla_Firefox_07-12-2024_20_11_33_edited.jpg";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1314967275530485763/1315670412281249876/hgh.png?ex=6758410e&is=6756ef8e&hm=37f2e0ccc92fde9963f6b51939caead2956057b1e0a8b4a135984f4261a07827&";
                            break;
                        default:
                            page.color = "#3498db"; // Set a default color if none matches
                            break;
                    }

                    pages.push(page);
                }

                return pages;
            };

            const slashCommandPages = createSlashCommandPages();
            const prefixCommandPages = createPrefixCommandPages();
            let currentPage = 0;
            let isPrefixHelp = false;

            const createEmbed = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                const page = pages[currentPage];

                if (!page) {
                    console.error('Page is undefined');
                    return new EmbedBuilder().setColor('#3498db').setTitle('Error').setDescription('Page not found.');
                }

                const fieldName = page.title === "Bot Information" ? "Additional Information" : "Commands";

                // Ensure a valid color is always set
                const color = page.color || '#3498db';

                return new EmbedBuilder()
                    .setTitle(page.title)
                    .setDescription(page.description)
                    .setColor(color)
                    .setImage(page.image)
                    .setThumbnail(page.thumbnail)
                    .setAuthor({ name: page.author.name, iconURL: page.author.iconURL, url: page.author.url })
                    .addFields({ name: fieldName, value: page.commands.join(', ') });
            };

            const createActionRow = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous1')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('next2')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === pages.length - 1),
                        new ButtonBuilder()
                            .setCustomId('prefix')
                            .setLabel(isPrefixHelp ? 'Normal Command List' : 'Excess Command List')
                            .setStyle(ButtonStyle.Secondary)
                    );
            };

            const createDropdown = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('page-select')
                            .setPlaceholder('Select a page')
                            .addOptions(pages.map((page, index) => ({
                                label: page.title,
                                value: index.toString()
                            })))
                    );
            };

            await interaction.reply({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (button) => {
                if (button.user.id !== interaction.user.id) return;

                if (button.isButton()) {
                    if (button.customId === 'previous1') {
                        currentPage = (currentPage - 1 + (isPrefixHelp ? prefixCommandPages : slashCommandPages).length) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'next2') {
                        currentPage = (currentPage + 1) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'prefix') {
                        isPrefixHelp = !isPrefixHelp;
                        currentPage = 0;
                    }
                } else if (button.isSelectMenu()) {
                    currentPage = parseInt(button.values[0]);
                }

                try {
                    await button.update({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });
                } catch (error) {
                    //console.error('Error updating the interaction:', error);
                }
            });

            collector.on('end', async () => {
                try {
                    await interaction.editReply({ components: [] });
                } catch (error) {
                    //console.error('Error editing the interaction reply:', error);
                }
            });
           }   else {
                const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Alert!", 
                    iconURL: cmdIcons.dotIcon ,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription('- This command can only be used through slash command!\n- Please use `/help`')
                .setTimestamp();
            
                await interaction.reply({ embeds: [embed] });
            
                } 
    }
};
