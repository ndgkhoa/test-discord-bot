import sheets from '~/config/sheets'

type CoordinateData = {
  id: string
  latitude: number
  longitude: number
}

export const getSheetData = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Sheet2!A2:C'
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      console.warn('Không tìm thấy dữ liệu trong sheet')
      return []
    }

    return rows
      .map((row, index) => {
        if (!row[0] && !row[1] && !row[2]) return null

        const parseEuropeanNumber = (numStr: string): number => {
          const cleaned = numStr.replace(/\./g, '').replace(',', '.')
          return parseFloat(cleaned)
        }

        try {
          const lat = row[1] ? parseEuropeanNumber(row[1]) : NaN
          const lng = row[2] ? parseEuropeanNumber(row[2]) : NaN

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Dòng ${index + 2} có tọa độ không hợp lệ:`, row)
            return null
          }

          return {
            id: row[0].toString(),
            latitude: lat,
            longitude: lng
          }
        } catch (error) {
          console.warn(`Lỗi xử lý dòng ${index + 2}:`, error)
          return null
        }
      })
      .filter(Boolean) as CoordinateData[]
  } catch (error) {
    console.error('Lỗi đọc dữ liệu từ Google Sheets:', error)
    throw new Error('Không thể đọc dữ liệu từ Google Sheets')
  }
}

export const getCoordinateById = async (id: string) => {
  const data = await getSheetData()
  return data.find((item) => item.id === id)
}
