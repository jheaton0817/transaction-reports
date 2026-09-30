import { pool } from "./database.js";
import { listReports } from "./reports/report-repository.js";

const reports = await listReports();

console.log(reports);

await pool.end();