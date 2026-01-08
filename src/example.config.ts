import { Collection } from 'discord.js';

import { ConfigType } from './typings';

export const Config: ConfigType = {
    dev: false,
    token: 'abc',
    dlist: 'abc',

    ad: 'Invite me now!',
    guildLogging: '123',

    apis: {
        tts: 'http://localhost:3000/invoke',

        // can be removed if not needed
        votes: 'http://localhost:3000/votes',
        votes_authorization: 'abc'
    },

    // if you dont know what this does, leave it
    verification: {
        enabled: false,
    },

    data: {
        events: new Collection(),
        interactions: {
            commands: new Collection()
        }
    },
    listings: [
        {
            active: true,
            url: 'https://top.gg/api/bots/985213199248924722/stats',
            authorization: 'abc',
            method: 'POST',
            structure: { guilds: 'server_count', shards: 'shard_count' }
        }
    ]
} ;

export const Emote = {
    error: '> <:dnd_status:949003440091201587>',
    success: '> <:online_status:949003338186383491>',
};