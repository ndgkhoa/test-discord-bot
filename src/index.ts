import express from 'express' // Thêm express
import dotenv from 'dotenv'

import { client } from './client'
import { REST, Routes } from 'discord.js'
import { commands } from './commands'

dotenv.config()

async function main() {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

    // Đăng ký commands mới
    console.log('Đang đăng ký commands mới...')
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commands.map((cmd) => cmd.data.toJSON())
    })
    console.log('Đăng ký commands mới thành công!')

    // Tạo HTTP server đơn giản
    const app = express()
    const port = process.env.PORT || 3000

    app.get('/', (req, res) => {
      res.send('Discord Bot is running!')
    })

    app.listen(port, () => {
      console.log(`HTTP server running on port ${port}`)
    })

    // Đăng nhập bot
    await client.login(process.env.DISCORD_TOKEN)
    console.log('Bot đã sẵn sàng!')
  } catch (error) {
    console.error('Lỗi khi khởi động bot:', error)
    process.exit(1)
  }
}

main()
