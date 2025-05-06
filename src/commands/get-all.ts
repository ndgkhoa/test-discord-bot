import { SlashCommandBuilder } from 'discord.js'

import { Command } from '~/types/command'
import { getPolicyList } from '~/services/policy-service'
import { createAllDataEmbed } from '~/utils/embed'

export const getAll: Command = {
  data: new SlashCommandBuilder().setName('getall').setDescription('Hiển thị tất cả chính sách'),
  async execute(interaction) {
    await interaction.deferReply()

    try {
      const userList = await getPolicyList()
      if (userList.length === 0) {
        await interaction.editReply('Không tìm thấy dữ liệu trong sheet.')
        return
      }

      const embed = createAllDataEmbed(userList)
      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error('Error:', error)
      await interaction.editReply('Đã xảy ra lỗi khi lấy dữ liệu từ Google Sheets.')
    }
  }
}
