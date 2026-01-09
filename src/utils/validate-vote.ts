import type { ButtonComponent, CommandInteraction } from "discord.js";
import { ButtonStyle, ComponentType, MessageFlags } from "discord.js";
import type { Selectable } from "kysely";

import { Config, Emote } from "../config";
import type { DatabaseUser } from "../db";
import { db } from "../db";

//   True: can run command
//   False: must vote / error happened
export async function validate(interaction: CommandInteraction, user?: Pick<Selectable<DatabaseUser>, "command_uses" | "verification_valid_until">): Promise<true | false> {
    if (new Date().getDay() !== 5 && new Date().getDay() !== 6 && new Date().getDay() !== 0) return true;
    if (!Config.verification.enabled) return true;

    if (!Config.apis.votes) throw new TypeError("\"api.votes\" was not defined but \"verification.enabled\" is set to true.");
    if (!Config.apis.votes_authorization) throw new TypeError("\"api.votes\" was not defined but \"verification.enabled\" is set to true.");

    if (!user) {
        await db
            .insertInto("users")
            .values({
                id: interaction.user.id,
                command_uses: 1
            })
            .execute();

        return true;
    }

    const now = Date.now();

    if (
        (user.command_uses + 1) <= Config.verification?.freeUse ||
        (user.verification_valid_until || 0) > now
    ) {
        await db
            .updateTable("users")
            .where("id", "=", interaction.user.id)
            .set({
                command_uses: user.command_uses + 1
            })
            .execute();

        return true;
    }

    const res = await fetch(`${Config.apis.votes}/${interaction.user.id}`, {
        headers: {
            authorization: Config.apis.votes_authorization
        }
    });

    if (!res.ok && res?.status !== 400) {
        await interaction.editReply({
            content: `${Emote.error} There was an error talking with our database.\n${Config.ad}`
        });

        throw new Error(`There was an error fetching from "${Config.apis.votes}/${interaction.user.id}"`);
    }

    const data = await res.json();

    if (user.verification_valid_until !== data.message && !Number.isNaN(data.message)) {
        await db
            .updateTable("users")
            .where("id", "=", interaction.user.id)
            .set({
                verification_valid_until: data.message || 0
            })
            .execute();
    }

    if (data.message < now || Number.isNaN(data.message)) {
        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: "# <:venniesad:1254760522474328064> We're experiencing high demand"
                        },
                        {
                            type: ComponentType.TextDisplay,
                            content: `>>> Uh Oh! Bots use ${interaction.user.username} too! [Please complete the verification process on Top.gg](${Config.verification.url}). After that, you can use Text-to-Speech as much as you want!\nWe thank you for your understanding! <a:doggolove:932368331179196446>`
                        }
                    ]
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Pass This Check",
                            url: Config.verification.url,
                            emoji: {
                                animated: true,
                                name: "toliet",
                                id: "828166715547320350"
                            }
                        },
                        Config.verification.premiumUrl ? {
                            type: ComponentType.Button,
                            style: ButtonStyle.Link,
                            label: "Upgrade to bypass",
                            url: Config.verification.premiumUrl,
                            emoji: {
                                animated: true,
                                name: "toliet",
                                id: "828166715547320350"
                            }
                        } : null
                    ]
                        .filter(Boolean) as ButtonComponent[]
                }
            ]
        });

        return false;
    }

    return true;
}