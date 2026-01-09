import type { Client } from "discord.js";
import { readdirSync } from "node:fs";

import type { Event } from "../typings";

export default async function (client: Client) {
    const eventFiles = readdirSync(`${process.cwd()}/dist/events`).filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
        const event: Event = (await import(`${process.cwd()}/dist/events/${file}`)).default;
        const argumentsFunction = (...args: unknown[]) => event.run(...args);

        if (event.once) client.once(event.name, argumentsFunction);
        else client.on(event.name, argumentsFunction);
    }
}