import { ButtonStyle, ComponentType } from "discord.js";

import type { Command } from "../../typings";

export default {
    name: "help",
    description: "Learn about, invite and vote for Audtional Text.",
    dm_permission: true,

    run: async (interaction) => {
        await interaction.reply({
            embeds: [
                {
                    description: `With **${interaction.client.user?.username}** you're able to either **convert text to .mp3 files** for you to download (</mp3:1004817057768034314>), or to **speak messages in voice channels** using </voice:1004817057768034315>. Note that there is a character limit of 300.\n\n[[Watch a YouTube Video about Chat to Speech](https://www.youtube.com/watch?v=NS5fZ1ltovE)]\n\n**Developers**\n[\`@mwlica\`](https://lunish.nl?utm_source=Auditional+Text&utm_medium=help) - Voice Conversion, Bot\n[\`@digital39999\`](https://crni.xyz/?utm_source=Auditional+Text&utm_medium=help) - Scalability`,
                    thumbnail: {
                        url: `https://cdn.discordapp.com/avatars/${interaction.client.user?.id}/${interaction.client.user?.avatar}.${interaction.client.user?.avatar?.startsWith("a_") ? "gif" : "png"}?size=1024`
                    },
                    color: 0x01_AF_8D
                }
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "About Wamellow",
                            url: "https://wamellow.com?utm_source=Audtional+Text&utm_medium=help",
                            emoji: {
                                animated: true,
                                name: "c_prideblob",
                                id: "932368100832202783"
                            }
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Support Server",
                            url: "https://discord.com/invite/w4QY2mhe3x",
                            emoji: {
                                name: "discord",
                                id: "1256328678497845390"
                            }
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Vote for Auditional Text",
                            url: "https://top.gg/bot/985213199248924722/vote",
                            emoji: {
                                name: "topggpride",
                                id: "1127378357961633802"
                            }
                        }
                    ]
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Invite Auditional Text",
                            url: "https://discord.com/api/oauth2/authorize?client_id=985213199248924722&permissions=3197952&scope=bot%20applications.commands",
                            emoji: {
                                name: "TTS",
                                id: "1111729122025156708"
                            }
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Invite Textional Voice",
                            url: "https://discord.com/api/oauth2/authorize?client_id=1097907896987160666&permissions=309239007232&scope=applications.commands%20bot",
                            emoji: {
                                name: "VTT",
                                id: "1111728972158472383"
                            }
                        }
                    ]
                }
            ]
        });
    }
} as Command;