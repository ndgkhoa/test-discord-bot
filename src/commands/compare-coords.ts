import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { getCoordinateById } from '~/services/location-service'
import { calculateDistance } from '~/utils/distance-calculator'

export const compareCoords = {
  data: new SlashCommandBuilder()
    .setName('compare-coords')
    .setDescription('So sánh tọa độ cố định với dữ liệu từ Google Sheets theo ID')
    .addStringOption((option) =>
      option.setName('id').setDescription('Nhập ID từ Google Sheets (cột A)').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()

    try {
      const id = interaction.options.getString('id', true)
      const coord = await getCoordinateById(id)

      if (!coord) {
        await interaction.editReply(`❌ Không tìm thấy tọa độ với ID: ${id}`)
        return
      }

      const FIXED_COORDS = {
        latitude: 10.737574,
        longitude: 106.729549
      }

      const result = calculateDistance(FIXED_COORDS.latitude, FIXED_COORDS.longitude, coord.latitude, coord.longitude)

      await interaction.editReply(
        `📌 **Kết quả cho ID ${id}**\n` +
          `📍 Tọa độ cố định: ${FIXED_COORDS.latitude}, ${FIXED_COORDS.longitude}\n` +
          `🛰️ Tọa độ từ Sheets: ${coord.latitude}, ${coord.longitude}\n` +
          `📏 Độ lệch: ${result.distance.toFixed(2)} mét\n` +
          `🟢 Trạng thái: ${result.status}`
      )
    } catch (error) {
      console.error(error)
      await interaction.editReply('❌ Lỗi khi tính toán độ lệch')
    }
  }
}
