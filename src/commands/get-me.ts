import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../types/command'
import { getUserData } from '../services/google-sheets'
import { createUserEmbed } from '../utils/embed'

export const getMe: Command = {
  data: new SlashCommandBuilder().setName('getme').setDescription('Hiển thị điểm của bạn từ Google Sheets'),
  async execute(interaction) {
    await interaction.deferReply()

    try {
      const user = await getUserData(interaction.user.id)
      if (!user) {
        await interaction.editReply('Không tìm thấy thông tin của bạn trong hệ thống.')
        return
      }

      const embed = createUserEmbed(user)
      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error('Error:', error)
      await interaction.editReply('Đã xảy ra lỗi khi lấy dữ liệu từ Google Sheets.')
    }
  }
}
