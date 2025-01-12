import { google } from "googleapis";
import { JWT } from "google-auth-library";
import fs from "fs";

// Load the service account credentials

const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!, "utf8"));

// Authenticate with the Google Sheets API
const auth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
export const fetchRowsWhereBIsEmpty = async (
    spreadsheetId: string = process.env.SPREADSHEET_ID!,
    sheetName: string = process.env.SHEET_NAME!,
    sheetRange: string = process.env.SHEET_RANGE!,
    splice: number = parseInt(process.env.FILTER_ROWS || "5", 10)
  ): Promise<{ row: any[]; index: number }[]> => {
    const range = `${sheetName}!${sheetRange}`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];

    // Map rows with their original indices
    const rowsWithIndices = rows.map((row, index) => ({ row, index: index + 1 })); // index + 1 because Sheets use 1-based indexing

    // Filter rows where column B is empty
    const filteredRows = rowsWithIndices.filter(({ row }) => !row[1] || row[1].trim() === "");

    // Return up to `splice` rows, but not more than the available rows
    return filteredRows.slice(0, splice);
  };


  export const updateSheetData = async (
    sheetRange: string,
    values: any[][]
  ): Promise<void> => {
    const spreadsheetId = process.env.SPREADSHEET_ID!;
    const sheetName = process.env.SHEET_NAME!;
    const range = `${sheetName}!${sheetRange}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
  };