import { readFile } from "node:fs/promises";
import { summariseTransactions } from "./reports/summary.js";
import { parseTransactions } from "./reports/parse-transactions.js";

try {

    const csvText = await readFile("samples/transactions.csv", "utf8");
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