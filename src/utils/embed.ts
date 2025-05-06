import { EmbedBuilder } from 'discord.js'

import { PolicyData } from '../services/policy-service'
import { LocationInfo } from '../services/ocr-service'

export const createAllDataEmbed = (policyList: PolicyData[]) => {
  const embed = new EmbedBuilder()
    .setTitle('Danh sách chính sách')
    .setColor(0x0099ff)
    .setDescription('Dữ liệu được lấy từ Google Sheets')
    .setTimestamp()

  policyList.forEach((policy) => {
    embed.addFields({
      name: policy.policy_name,
      value: `ID: ${policy.id}\nĐiểm tối thiểu: ${policy.score}\nGhi chú: ${policy.note || 'Không có'}`
    })
  })

  return embed
}

export const createUserEmbed = (policy: PolicyData) => {
  return new EmbedBuilder()
    .setTitle('Thông tin chính sách')
    .setColor(0x00ff00)
    .addFields(
      { name: 'Chính sách', value: policy.policy_name, inline: true },
      { name: 'Điểm tối thiểu', value: policy.score, inline: true },
      { name: 'Ghi chú', value: policy.note || 'Không có', inline: false }
    )
    .setTimestamp()
}

export const createLocationEmbed = (info: LocationInfo) => {
  const embed = new EmbedBuilder().setTitle('📍 Thông tin địa lý trích xuất').setColor(0x3498db).setTimestamp()

  if (info.dateTime) {
    embed.addFields({ name: '📅 Ngày giờ', value: info.dateTime, inline: false })
  }

  if (info.coordinates) {
    embed.addFields({ name: '🌐 Tọa độ', value: info.coordinates, inline: false })
  }

  if (info.mapsUrl) {
    embed.addFields({ name: '🗺️ Bản đồ', value: `[Xem trên Google Maps](${info.mapsUrl})`, inline: false })
  }

  if (info.address) {
    embed.addFields({ name: '🏠 Địa chỉ', value: info.address, inline: false })
  }

  return embed
}
