import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../types/command'
import { extractLocationInfo } from '../services/ocr-service'
import { createLocationEmbed } from '../utils/embed'

export const readLocation: Command = {
  data: new SlashCommandBuilder()
    .setName('read-location')
    .setDescription('Đọc thông tin địa chỉ và tọa độ từ ảnh')
    .addAttachmentOption((option) =>
      option.setName('image').setDescription('Ảnh chứa thông tin địa lý').setRequired(true)
    ) as SlashCommandBuilder,

  async execute(interaction) {
    try {
      await interaction.deferReply()

      const image = interaction.options.getAttachment('image')
      if (!image?.contentType?.startsWith('image/')) {
        await interaction.editReply('❌ Vui lòng gửi file ảnh hợp lệ (JPEG/PNG)')
        return
      }

      const locationInfo = await extractLocationInfo(image.url)

      if (!locationInfo.address && !locationInfo.coordinates) {
        await interaction.editReply('❌ Không tìm thấy thông tin địa lý trong ảnh')
        return
      }

      const embed = createLocationEmbed(locationInfo)
      await interaction.editReply({
        content: '✅ Đã trích xuất thông tin từ ảnh:',
        embeds: [embed]
      })
    } catch (error) {
      console.error('Lỗi khi thực thi lệnh:', error)
      await interaction.editReply('❌ Đã xảy ra lỗi khi xử lý ảnh. Vui lòng thử lại với ảnh rõ nét hơn.')
    }
  }
}
