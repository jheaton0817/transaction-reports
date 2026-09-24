import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTransactions } from "./parse-transactions.js";
import type { Transaction } from "./summary.js";
import { CsvValidationError } from "./csv-validation-error.js";

function parseOutputTest() { 

    const csvString = `description,amountPence,isIncome
    Salary,150000,true
    Rent,100000,false`;

    const parsedCSV = parseTransactions(csvString);

    const expected: Transaction[] = [
        {description: "Salary", amountPence: 150000, isIncome: true},
        {description: "Rent", amountPence: 100000, isIncome: false},
    ];

    assert.deepEqual(parsedCSV, expected);
}

function incomeErrorHelper() {

    const csvString = `description,amountPence,isIncome
    Salary,150000,maybe`;

    parseTransactions(csvString);

}

function incomeErrorTest() {

    assert.throws(
        incomeErrorHelper,
        new Error("Please check spelling of true or false in column isIncome")
    );

}

function emptyCSVHelper() { 

    parseTransactions("");

}

function emptyCSVErrorTest() {

    assert.throws(
        emptyCSVHelper,
        new Error("The CSV contains no transactions")
    );

}

function malformedCsvHelper() {

    const malformedCsvString: string = `description,amountPence,isIncome
"Salary,150000,true`;
    
    parseTransactions(malformedCsvString);

}

function testMalformedCsv() {

    assert.throws(
        malformedCsvHelper,
        CsvValidationError
    );

}


test("Testing the output of the parsed CSV contents", parseOutputTest);

test("rejects an invalid income flag", incomeErrorTest);

test("rejects an empty CSV", emptyCSVErrorTest);

test("rejects an unclosed CSV quote with a validation error", testMalformedCsv);