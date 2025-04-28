import { EmbedBuilder } from 'discord.js'
import { UserData } from '../services/google-sheets'
import { LocationInfo } from '../services/ocr-service'

export const createAllDataEmbed = (users: UserData[]) => {
  const embed = new EmbedBuilder()
    .setTitle('Danh sách điểm')
    .setColor(0x0099ff)
    .setDescription('Dữ liệu được lấy từ Google Sheets')
    .setTimestamp()

  users.forEach((user) => {
    embed.addFields({
      name: user.name,
      value: `ID: ${user.id}\nĐiểm: ${user.score}\nGhi chú: ${user.note || 'Không có'}`,
      inline: true
    })
  })

  return embed
}

export const createUserEmbed = (user: UserData) => {
  return new EmbedBuilder()
    .setTitle('Thông tin của bạn')
    .setColor(0x00ff00)
    .addFields(
      { name: 'Tên', value: user.name, inline: true },
      { name: 'Điểm', value: user.score, inline: true },
      { name: 'Ghi chú', value: user.note || 'Không có', inline: false }
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
