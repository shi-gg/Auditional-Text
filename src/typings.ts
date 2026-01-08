import { APIApplicationCommandOption, ChatInputCommandInteraction, Collection } from 'discord.js';

export type Command = {
    name: string;
    description: string;
    options?: APIApplicationCommandOption[];
    dm_permission?: boolean;

    run: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export type Event = {
    name: string;
    once?: boolean;

    run: (...arg0: unknown[]) => void;
}

export type ConfigType = {
    dev: boolean;
    token: string;
    dlist: string;

    ad: string;
    guildLogging: string;

    apis: {
        tts: string;
        votes?: string;
        votes_authorization?: string;
    }

    // verify user's as real users by voting lmao
    verification: { enabled: false; } | {
        enabled: true;
        url: string;
        premiumUrl?: string;
        freeUse: number;
    }

    data: {
        events: Collection<string, Event>;
        interactions: {
            commands: Collection<string, Command>;
        }
    }

    listings: {
        active: boolean;
        url: string;
        authorization: string;
        method: 'PATCH' | 'POST' | 'PUT';
        structure: {
            guilds: string;
            shards?: string;
        }
        query?: boolean;
    }[]
}