import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
})

const sheets = google.sheets({ version: 'v4', auth })

export interface UserData {
  id: string
  name: string
  score: string
  note?: string
}

export const getSheetData = async (): Promise<UserData[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: 'Sheet1!A2:D'
  })

  const rows = response.data.values
  if (!rows || rows.length === 0) return []

  //   return rows.map((row) => ({
  //     id: row[0],
  //     name: row[1],
  //     score: row[2],
  //     note: row[3]
  //   }))
  return rows
    .map((row) => {
      if (!row[0] || !row[1] || !row[2]) {
        console.warn('Dòng không hợp lệ:', row)
        return null
      }
      return {
        id: row[0].trim(),
        name: row[1].trim(),
        score: row[2].trim(),
        note: row[3]?.trim()
      }
    })
    .filter(Boolean) as UserData[]
}

export const getUserData = async (userId: string): Promise<UserData | null> => {
  const data = await getSheetData()
  return data.find((user) => user.id === userId) || null
}
