import type { Transaction } from "./reports/summary.js";
import { summariseTransactions } from "./reports/summary.js";

const transactions: Transaction[] = [
    {description: "Salary", amountPence: 300000, isIncome: true},
    {description: "Rent", amountPence: 100000, isIncome: false},
    {description: "Groceries", amountPence: 50000, isIncome: false},
    {description: "Freelance Work", amountPence: 150000, isIncome: true}
];

const result = summariseTransactions(transactions);

console.log(result);