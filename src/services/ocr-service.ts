import Tesseract from 'tesseract.js'

export interface LocationInfo {
  dateTime?: string
  coordinates?: string
  address?: string | null
  mapsUrl?: string | null
  confidence?: number
}

export const extractLocationInfo = async (imageUrl: string): Promise<LocationInfo> => {
  console.log('Bắt đầu xử lý ảnh...')

  try {
    const {
      data: { text }
    } = await Tesseract.recognize(imageUrl, process.env.TESSERACT_LANG || 'eng')

    console.log('Văn bản trích xuất được:', text)

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)

    const dateTime = lines.find((line) => /\d{1,2} Th\d, \d{4} \d{1,2}:\d{2}:\d{2}/.test(line))
    const coordsLineIndex = lines.findIndex((line) => /[NS]/.test(line) && /[EW]/.test(line))

    let coordinates: string | undefined = undefined
    let address: string | undefined = undefined

    if (coordsLineIndex !== -1) {
      coordinates = lines[coordsLineIndex].replace(/,/g, '.')

      const addressLines: string[] = []
      for (let i = coordsLineIndex + 1; i < lines.length; i++) {
        let line = lines[i]
        if (line.length < 3) break

        if (line.startsWith(':')) {
          line = line.slice(1).trim()
        }

        addressLines.push(line)
      }
      address = addressLines.join(', ')
    }

    console.log('Thông tin địa lý trích xuất:', { dateTime, coordinates, address })

    let mapsUrl = ''
    if (coordinates) {
      const [lat, long] = coordinates.split(' ')
      mapsUrl = `https://www.google.com/maps?q=${lat},${long}`
    }

    return { dateTime, coordinates, address, mapsUrl }
  } catch (error) {
    console.error('Lỗi khi xử lý OCR:', error)
    throw error
  }
}
