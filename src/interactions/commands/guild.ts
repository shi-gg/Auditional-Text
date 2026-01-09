import { ApplicationCommandOptionType } from "discord.js";

import { Config, Emote } from "../../config";
import { db } from "../../db";
import type { Command } from "../../typings";

export default {
    name: "guild",
    description: "Setting up your guild, your way, I guess.",
    options: [
        {
            name: "voice_timeout",
            description: "How long the bot continues to stay inside your voice channel after /voice.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "time",
                    description: "Seconds",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        }
    ],
    dm_permission: false,

    run: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guildId || !interaction.memberPermissions?.has("ManageGuild")) {
            await interaction.editReply({
                content: `${Emote.error} You are missing \`ManageGuild\` permissions.\n${Config.ad}`
            });

            return;
        }

        const command = interaction.options.getSubcommand(false);

        switch (command) {
            case "voice_timeout": {
                const timeout = interaction.options.getInteger("time") ?? 30;

                if (timeout > 1_000 * 60 * 8) {
                    await interaction.editReply({
                        content: `${Emote.error} Timeout cannot be above **8 minutes**, contact support.\n${Config.ad}`
                    });

                    return;
                }

                const guild = await db
                    .insertInto("guilds")
                    .values({
                        id: interaction.guildId,
                        timeout
                    })
                    .onConflict((conflict) => (
                        conflict
                            .column("id")
                            .doUpdateSet({ timeout })
                    ))
                    .returning("timeout")
                    .executeTakeFirstOrThrow();

                await interaction.editReply({
                    content: `${Emote.success} Successfully set timeout to **${guild.timeout} seconds**.\n${Config.ad}`
                });

                break;
            }
        }

    }
} as Command;