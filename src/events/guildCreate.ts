import type { Guild, TextChannel } from "discord.js";
import { ButtonStyle, ComponentType } from "discord.js";

import { Config } from "../config";

export default {
    name: "guildCreate",
    run: async (guild: Guild) => {

        await fetch(`https://discord.com/api/channels/${Config.guildLogging}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${guild.client.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: `<:tick:1028684977975607378> Joined **${guild.name}** with ${guild.memberCount} members` })
        });

        let channel: TextChannel | null = null;
        if (
            guild.systemChannelId &&
            guild.members.me?.permissionsIn(guild.systemChannelId).has(["ViewChannel", "SendMessages", "EmbedLinks"])
        )
            channel = guild.systemChannel;

        if (
            !channel &&
            guild.publicUpdatesChannelId &&
            guild.members.me?.permissionsIn(guild.publicUpdatesChannelId).has(["ViewChannel", "SendMessages", "EmbedLinks"])
        )
            channel = guild.publicUpdatesChannel;

        if (!channel) return;

        await channel.send({
            embeds: [
                {
                    description: `## How do I use ${guild.client.user.username}?\nTo use Text-to-Speech, either run </mp3:1004817057768034314> or </voice:1004817057768034315> anywhere.\n\nIf you need help, join [our Support Server](https://discord.gg/w4QY2mhe3x) and ask us in [#・support-n-help](https://discord.com/channels/828676951023550495/1053269191588847617).`,
                    color: 0x03_E6_B1
                }
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Join Support",
                            url: "https://discord.gg/w4QY2mhe3x",
                            emoji: {
                                name: "discord",
                                id: "1256328678497845390"
                            }
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Invite Wamellow",
                            url: "https://discord.com/oauth2/authorize?client_id=1125449347451068437&redirect_uri=https%3A%2F%2Fwamellow.com%2Flogin&permissions=1409558244470&prompt=none&response_type=code&state=%252F&scope=identify+guilds+bot",
                            emoji: {
                                animated: true,
                                name: "c_prideblob",
                                id: "932368100832202783"
                            }
                        }
                    ]
                }
            ]
        });
    }
};