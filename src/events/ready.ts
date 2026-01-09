import type { ApplicationCommandDataResolvable } from "discord.js";
import { ActivityType } from "discord.js";
import { Client as Dlist } from "dlist.js";
import type { ShardingClient } from "status-sharding";

import { Config } from "../config";

export default {
    name: "ready",
    once: true,
    run: async (client: ShardingClient) => {
        console.log(`Hello from ${client.cluster.id}`);

        const Interactions: ApplicationCommandDataResolvable[] = [];

        client.user?.setPresence({
            status: "online",
            activities: [
                {
                    type: ActivityType.Custom,
                    name: "<a:emoji_174:948133729535135744>",
                    state: `#${client.cluster.id} • wamellow.com`
                }
            ]
        });

        for (const command of Config.data.interactions.commands.values()) {
            Interactions.push({
                name: command.name,
                description: command.description,
                options: command.options,
                dm_permission: command.dm_permission
            });
        }

        await client.application?.commands.set(Interactions);

        if (client.cluster.id !== 0) return;

        const dlist = new Dlist({
            token: Config.dlist,
            bot: client.user?.id || ""
        });

        setInterval(
            async () => {
                const guildsArray = await client.cluster.broadcastEval((c) => c.guilds.cache.size) as number[];
                const guilds = guildsArray.reduce((acc, guildCount) => acc + guildCount, 0);

                void dlist.postGuilds(guilds);
                void postStats(client, guilds);
            },
            10 * 60 * 1_000
        );
    }
};

async function postStats(client: ShardingClient, guildCount: number) {
    for (const listing of Config.listings) {
        if (!listing.active) continue;

        let params = "";
        const body: Record<string, number | undefined> = {};

        if (listing.query) {
            if (listing.structure.guilds) params += `?${listing.structure.guilds}=${guildCount}`;
            if (listing.structure.shards) params += `&${listing.structure.shards}=${client.options.shardCount}`;
        } else {
            if (listing.structure.guilds) body[listing.structure.guilds] = guildCount;
            if (listing.structure.shards) body[listing.structure.shards] = client.options.shardCount;
        }

        await fetch(`${listing.url}${params}`, {
            method: listing.method,
            headers: {
                "Content-Type": "application/json",
                Authorization: listing.authorization
            },
            body: body ? JSON.stringify(body) : undefined
        }).catch((error) => {
            if (!error.message?.includes("520")) console.log(listing.url.split("//")[1].split("/")[0], error);
        });
    }
}