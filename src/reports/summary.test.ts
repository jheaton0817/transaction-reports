import { test } from "node:test";
import assert from "node:assert/strict";
import { summariseTransactions, type Transaction } from "./summary.js";

function checkSummary() {

    const transactions: Transaction[] = [

        {description: "Salary", amountPence: 100000, isIncome: true},
        {description: "Freelance", amountPence: 50000, isIncome: true},
        {description: "Rent", amountPence: 50000, isIncome: false},
        {description: "Groceries", amountPence: 75000, isIncome: false},

    ];

    const transactionSummary = summariseTransactions(transactions);

    assert.equal(transactionSummary.totalIncomePence, 150000);
    assert.equal(transactionSummary.totalExpensesPence, 125000);
    assert.equal(transactionSummary.balancePence, 25000);

}

function checkEmptySummary() {

    const transactions: Transaction[] = [];

    const transactionSummary = summariseTransactions(transactions);

    assert.equal(transactionSummary.totalIncomePence, 0);
    assert.equal(transactionSummary.totalExpensesPence, 0);
    assert.equal(transactionSummary.balancePence, 0);

}

function checkNegativeBalance() {

    const transactions: Transaction[] = [

        {description: "Rent", amountPence: 25000, isIncome: false},

    ];

    const transactionsSummary = summariseTransactions(transactions);

    assert.equal(transactionsSummary.totalIncomePence, 0);
    assert.equal(transactionsSummary.totalExpensesPence, 25000);
    assert.equal(transactionsSummary.balancePence, -25000);

}

test("adds multiple incomes and expenses correctly", checkSummary);

test("returns zero totals when there are no transactions", checkEmptySummary);

test("returns negative total for balancePence when expenses are greater than income", checkNegativeBalance);