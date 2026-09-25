import type { Transaction } from "./summary.js";
import { parse, CsvError } from "csv-parse/sync";
import { CsvValidationError } from "./csv-validation-error.js";

function validateHeaders(headers: string[]): string[] {

    if (!(headers.length === 3)) {

        throw new CsvValidationError("The file must have 3 headers");
    }

    if (headers[0] !== "description") {

        throw new CsvValidationError("Header 1 name doesn't match 'description'");

    }

    if (headers[1] !== "amountPence") {

        throw new CsvValidationError("Header 2 name doesn't match 'amountPence'");

    }
    
    if (headers[2] !== "isIncome") {

        throw new CsvValidationError("Header 3 name doesn't match 'isIncome'");

    }

    return headers;
}

export function parseTransactions(csvText: string): Transaction[] {

    const transactions: Transaction[] = [];

    let rows: unknown[]; 
    
    try {
        
        rows = parse(csvText, {
        columns: validateHeaders,
        skip_empty_lines: true, 
        });

    }

    catch(error) {

        if((error instanceof CsvError) && (error.code === "CSV_QUOTE_NOT_CLOSED")) {

            throw new CsvValidationError("CSV quotation mark isn't closed");
        }
        else {

            throw error;
        }
    }

    if (rows.length === 0) {

        const problem = new CsvValidationError("The CSV contains no transactions");

        throw problem;

    }

    for (const row of rows) {

    if ((typeof row) !== "object" || row === null) {

        throw new CsvValidationError("row type not an object");

    }

    if (!("isIncome" in row)) {

        throw new CsvValidationError("isIncome isn't present");

    }
    
    if(!(row.isIncome === "true" || row.isIncome === "false")) {

        throw new CsvValidationError("Please check spelling of true or false in column isIncome");
    
    }

    if (!("description" in row)) {

        throw new CsvValidationError("Description is not present");

    }

    if ((typeof row.description) !== "string") {

        throw new CsvValidationError("Make sure description is a string");

    }

    if (row.description.trim() === "") {

        throw new CsvValidationError("Description must have a value");

    }

    if (!("amountPence" in row)) {

        throw new CsvValidationError("Amount in Pence must be present");

    }

    if ((typeof row.amountPence) !== "string") {

        throw new CsvValidationError("Raw value of amount is not a string");

    }

    if (row.amountPence.trim() === "") {

        throw new CsvValidationError("Amount field must not be blank");

    }

    const amountPenceNumber = Number(row.amountPence);

    if (!(Number.isSafeInteger(amountPenceNumber))) {

        throw new CsvValidationError("Number must be a safe integer");

    }

    if (amountPenceNumber <= 0) {

        throw new CsvValidationError("Amount must be greater than 0");

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

    return transactions;

}