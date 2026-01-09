import type { VoiceConnection } from "@discordjs/voice";
import { Collection, GatewayIntentBits, Options } from "discord.js";
import { ShardingClient } from "status-sharding";

import { Config } from "./config";

export const client = new ShardingClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ],
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        ApplicationCommandManager: 0,
        ApplicationEmojiManager: 0,
        AutoModerationRuleManager: 0,
        BaseGuildEmojiManager: 0,
        DMMessageManager: 0,
        EntitlementManager: 0,
        GuildBanManager: 0,
        GuildEmojiManager: 0,
        GuildForumThreadManager: 0,
        GuildInviteManager: 0,
        GuildMessageManager: 0,
        GuildScheduledEventManager: 0,
        GuildStickerManager: 0,
        GuildTextThreadManager: 0,
        MessageManager: 0,
        PresenceManager: 0,
        ReactionManager: 0,
        ReactionUserManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        UserManager: 0
    })
});

export const connections = new Collection<string, VoiceConnection>();
export const isPlaying = new Collection<string, string>();
export const disconnect = new Collection<string, number>();

for (const name of ["interactions", "events"]) {
    void import(`./handlers/${name}`)
        .then((func) => func.default(client));
}

void client.login(Config.token);

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
});