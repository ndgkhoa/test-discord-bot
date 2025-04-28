import { Client, IntentsBitField, Interaction } from 'discord.js'
import { commands } from './commands'

export const client = new Client({
  intents: [IntentsBitField.Flags.Guilds]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.find((cmd) => cmd.data.name === interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`, error)

    const content = 'There was an error while executing this command!'
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content, ephemeral: true })
    } else {
      await interaction.reply({ content, ephemeral: true })
    }
  }
})
