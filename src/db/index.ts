import { Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME
        })
    })
});

export interface DatabaseGuild {
    id: string;
    timeout: Generated<number>;
}

export interface DatabaseUser {
    id: string;
    default_voice: Generated<string | null>;

    command_uses: Generated<number>;
    verification_valid_until: Generated<number | null>;
}

interface Database {
    guilds: DatabaseGuild;
    users: DatabaseUser
}