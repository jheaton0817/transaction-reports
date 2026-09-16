export type Transaction = {
    description: string;
    amountPence: number;
    isIncome: boolean;
};

type TransactionSummary = {
    totalIncomePence: number;
    totalExpensesPence: number;
    balancePence: number;
};

export function summariseTransactions(transactions: Transaction[]): TransactionSummary {

    let totalIncomePence = 0;
    let totalExpensesPence = 0;
    let balancePence = 0;

    for (const transaction of transactions) {

        if(transaction.isIncome) {

            totalIncomePence += transaction.amountPence;
            balancePence += transaction.amountPence;

        }
        else {

            totalExpensesPence += transaction.amountPence;
            balancePence -= transaction.amountPence;

        }
    }

    return {   

        totalIncomePence: totalIncomePence,
        totalExpensesPence: totalExpensesPence,
        balancePence: balancePence,
        
    }

}