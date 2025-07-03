export class GoogleSheetService {
  static async sheetExists(spreadsheetId: string, token: string): Promise<boolean> {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.ok;
    } catch (error) {
      console.error('Error checking sheet existence:', error);
      return false;
    }
  }

  static async createSheet(token: string): Promise<string | null> {
    try {
      const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: { title: `CustomerData_${Date.now()}` },
          sheets: [{ properties: { title: 'Sheet1' } }],
        }),
      });

      const sheetData = await response.json();
      const spreadsheetId = sheetData?.spreadsheetId;

      if (!spreadsheetId) {
        console.error('Sheet creation failed:', sheetData);
        return null;
      }

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:G1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [["Name", "Email", "Credit", "Debit", "Details", "Start Date", "End Date"]],
          }),
        }
      );

      return spreadsheetId;
    } catch (error) {
      console.error('createSheet error:', error);
      return null;
    }
  }

  static async appendCustomerData(
    spreadsheetId: string,
    token: string,
    values: string[][]
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        console.error('Append error:', err);
        return false;
      }

      return true;
    } catch (error) {
      console.error('appendCustomerData error:', error);
      return false;
    }
  }
static async getCustomerData(spreadsheetId: string, token: string): Promise<string[][] | null> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:G`, // A2:G skips header
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Fetch data error:', err);
      return null;
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('getCustomerData error:', error);
    return null;
  }
}


}

