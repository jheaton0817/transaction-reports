import { pool } from "../database.js";

type ReportRow = {
    file_name: string;
    total_income_pence: string;
    total_expenses_pence: string;
    balance_pence: string;
    created_at: Date;
};

export async function listReports(): Promise<ReportRow[]> {

    const result = await pool.query<ReportRow>(`SELECT file_name, total_income_pence, total_expenses_pence, total_income_pence - total_expenses_pence AS balance_pence, created_at
    FROM reports
    ORDER BY created_at DESC;`);

    return(result.rows);

}

export async function saveReport(fileName: string, totalIncomePence: number, totalExpensesPence: number): Promise<void> {

    await pool.query(
        "INSERT INTO reports (file_name, total_income_pence, total_expenses_pence) VALUES ($1, $2, $3);",
        [fileName, totalIncomePence, totalExpensesPence]
    );
}