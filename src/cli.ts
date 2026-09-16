import { readFile } from "node:fs/promises";
import type { Transaction } from "./reports/summary.js";
import { summariseTransactions } from "./reports/summary.js";
import { parse } from "csv-parse/sync";

const transactions: Transaction[] = [];

const csvText = await readFile("samples/transactions.csv", "utf8");

const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true, 
});

for (const row of rows) {

    if ((typeof row) !== "object" || row === null) {

        throw new Error("row type not an object");

    }

    if (!("isIncome" in row)) {

        throw new Error("isIncome isn't present");

    }
    
    if(!(row.isIncome === "true" || row.isIncome === "false")) {

        throw new Error("Please check spelling of true or false in column isIncome");
    
    }

    if (!("description" in row)) {

        throw new Error("Description is not present");

    }

    if ((typeof row.description) !== "string") {

        throw new Error("Make sure description is a string");

    }

    if (row.description.trim() === "") {

        throw new Error("Description must have a value");

    }

    if (!("amountPence" in row)) {

        throw new Error("Amount in Pence must be present");

    }

    if ((typeof row.amountPence) !== "string") {

        throw new Error("Raw value of amount is not a string");

    }

    if (row.amountPence.trim() === "") {

        throw new Error("Amount field must not be blank");

    }

    const amountPenceNumber = Number(row.amountPence);

    if (!(Number.isSafeInteger(amountPenceNumber))) {

        throw new Error("Number must be a safe integer");

    }

    if (amountPenceNumber <= 0) {

        throw new Error("Amount must be greater than 0");

    }

    const trimmedDescription: string = row.description.trim();
    
    let incomeTrue: boolean = false;

    if (row.isIncome === "true") {

        incomeTrue = true;
    };

    transactions.push({
        description: trimmedDescription, 
        amountPence: amountPenceNumber, 
        isIncome: incomeTrue
    });

}

console.log("All transaction rows passed validation");

const importedTransactionSummary = summariseTransactions(transactions);

console.log(importedTransactionSummary);


