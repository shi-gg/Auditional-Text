import type { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction } from "discord.js";

import { Config } from "../config";
import type { Command } from "../typings";

export default {
    name: "interactionCreate",
    run: async (interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction) => {
        if (!interaction.client.isReady()) return;

        if (interaction.isChatInputCommand()) {
            const command: Command | undefined = Config.data.interactions.commands.get(interaction.commandName);

            if (command) await command?.run(interaction).catch(console.log);
            else await interaction.reply({ content: "This command does not exist.", ephemeral: true });
        }
    }
};