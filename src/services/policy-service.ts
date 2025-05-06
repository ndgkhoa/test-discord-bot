import sheets from '~/config/sheets'

export type PolicyData = {
  id: string
  policy_name: string
  score: string
  note?: string
}

export const getSheetData = async () => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: 'Sheet1!A2:D'
  })

  const rows = response.data.values
  if (!rows || rows.length === 0) return []

  return rows.map((row) => {
    return {
      id: row[0],
      policy_name: row[1],
      score: row[2],
      note: row[3]
    }
  })
}

export const getPolicybyId = async (id: string) => {
  const data = await getSheetData()
  return data.find((user) => user?.id === id)
}

export const getPolicyList = async () => {
  return await getSheetData()
}
