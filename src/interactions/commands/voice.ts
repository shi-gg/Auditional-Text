import { createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { ApplicationCommandOptionType, ButtonStyle, ComponentType } from "discord.js";
import getAudioDurationInSeconds from "get-audio-duration";
import fs from "node:fs";

import { connections, disconnect, isPlaying } from "../../app";
import { Config, Emote } from "../../config";
import { db } from "../../db";
import type { Command } from "../../typings";
import { getData } from "../../utils/tts";
import { validate } from "../../utils/validate-vote";
import voices from "../../voices.json";

export default {
    name: "voice",
    description: "Want to speak as me in a voice channel?",
    options: [
        {
            name: "text",
            description: "What text should get transformed?",
            type: ApplicationCommandOptionType.String,
            maxLength: 300,
            required: true
        },
        {
            name: "voice",
            description: "What voice should be used?",
            type: ApplicationCommandOptionType.String,
            choices: voices
        }
    ],
    dm_permission: false,

    run: async (interaction) => {
        const member = await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);

        if (!member?.voice.channelId) {
            await interaction.reply({
                content: `${Emote.error} You're not connected to any Voice Channels.\n${Config.ad}`,
                ephemeral: true
            });

            return;
        }

        if (!interaction.guild?.members.me?.permissionsIn(member.voice.channelId).has(["ViewChannel", "Connect", "Speak"])) {
            await interaction.reply({
                content: `${Emote.error} I'm not able to **View**/**Connect**/**Speak** in your Voice Channel.\n${Config.ad}`,
                ephemeral: true
            });

            return;
        }

        if (isPlaying.get(interaction.guildId || "")) {
            await interaction.reply({
                content: `${Emote.error} Please wait until the current audio by <@${isPlaying.get(interaction.guildId || "")}> is done playing.\n${Config.ad}`,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                style: ButtonStyle.Link,
                                url: "https://discord.com/oauth2/authorize?client_id=1125449347451068437&redirect_uri=https://wamellow.com/login&response_type=code&permissions=1426738113654&prompt=none&scope=identify+guilds+bot",
                                emoji: {
                                    name: "BlahajReach",
                                    id: "1213502811870986321"
                                },
                                label: "Get a 2nd Text to Speech bot for Voice Channels"
                            }
                        ]
                    }
                ],
                ephemeral: true
            });

            return;
        }

        if (!interaction.guild?.voiceAdapterCreator) return;

        await interaction.deferReply({
            ephemeral: !interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(["ViewChannel", "SendMessages"])
        })
            .catch(() => null);

        const textInput = interaction.options.getString("text", true);
        const voice = interaction.options.getString("voice");

        const user = await db
            .selectFrom("users")
            .select(["command_uses", "verification_valid_until", "default_voice"])
            .where("id", "=", interaction.user.id)
            .executeTakeFirst();

        if (!await validate(interaction, user)) return;

        const res = await getData(textInput, voice || user?.default_voice || "en_us_002");
        if (!res) {
            await interaction.editReply({
                content: `${Emote.error} Something went wrong playing this file. **This often happens because of a language-input missmatch!**\n${Config.ad}`
            });

            return;
        }

        const duration = await getAudioDurationInSeconds(res);

        const connection = joinVoiceChannel({
            adapterCreator: interaction.guild.voiceAdapterCreator,
            channelId: member?.voice.channelId,
            guildId: interaction.guildId!
        });

        connections.set(interaction.guildId!, connection);
        isPlaying.set(interaction.guildId!, interaction.user.id);
        disconnect.set(interaction.guildId!, Date.now());

        const player = createAudioPlayer();
        const resource = createAudioResource(res);

        connection.subscribe(player);
        player.play(resource);

        await interaction.editReply({ content: `${Emote.success} Now playing in <#${member?.voice.channelId}> for **${duration} seconds**.\n${Config.ad}` });

        setTimeout(
            () => {
                fs.unlink(res, () => null);
                isPlaying.delete(interaction.guildId!);
            },
            Math.max(duration, 1_000) + 1_000
        );

        const guild = await db
            .selectFrom("guilds")
            .select(["timeout"])
            .where("id", "=", interaction.guildId)
            .executeTakeFirst();

        const time = duration + (guild?.timeout ?? 30) * 1_000;
        setTimeout(
            () => {
                if (((disconnect.get(interaction.guildId!) ?? 0) + time) > Date.now()) return;

                try {
                    connection.disconnect();
                    isPlaying.delete(interaction.guildId!);
                    connections.delete(interaction.guildId!);
                    disconnect.delete(interaction.guildId!);
                } catch (error) {
                    console.log(error);
                }
            },
            Math.max(time, 1_000)
        );
    }
} as Command;