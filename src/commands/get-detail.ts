import { SlashCommandBuilder } from 'discord.js'

import { Command } from '~/types/command'
import { getPolicybyId } from '~/services/policy-service'
import { createUserEmbed } from '~/utils/embed'

export const getDetail: Command = {
  data: new SlashCommandBuilder()
    .setName('getdetail')
    .setDescription('Hiển thị thông tin chính sách chi tiết')
    .addStringOption((option) =>
      option.setName('id').setDescription('Nhập ID chính sách cần tra cứu').setRequired(true)
    ) as SlashCommandBuilder,
  async execute(interaction) {
    await interaction.deferReply()

    try {
      const inputId = interaction.options.getString('id', true)
      const policy = await getPolicybyId(inputId)
      if (!policy) {
        await interaction.editReply(`Không tìm thấy chính sách với ID: \`${inputId}\``)
        return
      }

      const embed = createUserEmbed(policy)
      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error('Error:', error)
      await interaction.editReply('Đã xảy ra lỗi khi lấy dữ liệu từ Google Sheets.')
    }
  }
}
