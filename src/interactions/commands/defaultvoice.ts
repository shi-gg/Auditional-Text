import { ApplicationCommandOptionType } from "discord.js";

import { Config, Emote } from "../../config";
import { db } from "../../db";
import type { Command } from "../../typings";
import voices from "../../voices.json";

export default {
    name: "defaultvoice",
    description: "What should be the default speaker used for you?",
    options: [
        {
            name: "voice",
            description: "What voice should be used?",
            type: ApplicationCommandOptionType.String,
            choices: voices.slice(0, 25),
            required: true
        }
    ],
    dm_permission: true,

    run: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const voice = interaction.options.getString("voice") || "en_us_002";

        const user = await db
            .insertInto("users")
            .values({
                id: interaction.user.id,
                default_voice: voice
            })
            .onConflict((conflict) => (
                conflict
                    .column("id")
                    .doUpdateSet({
                        default_voice: voice
                    })
            ))
            .returning("default_voice")
            .executeTakeFirstOrThrow();

        await interaction.editReply({
            content: `${Emote.success} Your default voice has been set to \`${user.default_voice}\`!\n${Config.ad}`
        });
    }
} as Command;