import { ApplicationCommandOptionType } from "discord.js";
import fs from "node:fs";

import { Config, Emote } from "../../config";
import { db } from "../../db";
import type { Command } from "../../typings";
import { getData } from "../../utils/tts";
import { validate } from "../../utils/validate-vote";
import voices from "../../voices.json";

export default {
    name: "mp3",
    description: "Want to convert a Text to a nice MP3?",
    options: [
        {
            name: "text",
            description: "What text should get transformed?",
            type: ApplicationCommandOptionType.String,
            maxLength: 300,
            required: true
        },
        {
            name: "visibility",
            description: "Should others be able to see what you do?",
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "public",
                    value: "public"
                },
                {
                    name: "hidden",
                    value: "hidden"
                }
            ]
        },
        {
            name: "voice",
            description: "What voice should be used?",
            type: ApplicationCommandOptionType.String,
            choices: voices
        }
    ],
    dm_permission: true,

    run: async (interaction) => {
        const visibility = interaction.options.getString("visibility") || "visible";

        await interaction.deferReply({ ephemeral: !interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(["ViewChannel", "SendMessages", "AttachFiles"]) || visibility === "hidden" });

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
                content: `${Emote.error} Something went wrong playing this file. This often happens because of a language-input missmatch!\n${Config.ad}`
            });

            return;
        }

        await interaction.editReply({
            content: Config.ad,
            files: [{
                attachment: res,
                name: new Date().toISOString().replace("T", " ").replace("Z", "") + ".mp3"
            }]
        });

        setTimeout(() => {
            fs.unlink(res, () => null);
        }, 4 * 1_000);
    }
} as Command;