import { readFile } from "node:fs/promises";
import { summariseTransactions } from "./reports/summary.js";
import { parseTransactions } from "./reports/parse-transactions.js";

try {

    const filePath = process.argv[2];
    
    if (filePath === undefined) {

        throw new Error("Please follow the command layout node dist/cli.js your-csv-path");
    }

    const csvText = await readFile(filePath, "utf8");
    const transactions = parseTransactions(csvText);
    const importedTransactionSummary = summariseTransactions(transactions);
    console.log("All transaction rows passed validation");
    console.log(importedTransactionSummary);

} catch (error) {

    if (error instanceof Error) {
        console.error(error.message);
    } else { 
        console.error("An unexpected problem occured");
    }

    process.exitCode = 1;
    
}