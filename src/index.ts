import dotenv from 'dotenv'
import { client } from './client'
import { REST, Routes } from 'discord.js'
import { commands } from './commands'

dotenv.config()

async function main() {
  try {
    // Đăng ký commands
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

    console.log('Đang đăng ký commands...')
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commands.map((cmd) => cmd.data.toJSON())
    })
    console.log('Đăng ký commands thành công!')

    // Đăng nhập bot
    await client.login(process.env.DISCORD_TOKEN)
    console.log('Bot đã sẵn sàng!')
  } catch (error) {
    console.error('Khởi động bot thất bại:', error)
    process.exit(1)
  }
}

main()
