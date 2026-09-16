# WHAT WILL THE APP DO?

The app will allow a user to sign in, upload a CSV of transactions, it will process it in the background and send an email of the summary report, as well as a dashboard filled with past uploads.

# FIRST MILESTONE

Read a local transaction CSV and produce an income, expense and balance summary.

# LEARNING APPROACH

I write the code myself, I use AI only to help me explain something I don't understand, or to review my code.

# FIRST WORKING STEP

It now summarises hardcoded example transactions; CSV reading is next. Both a defined type and function are exported from src/reports/summary.ts and imported into ./reports/cli.ts.

I then checked and compiled with npx tsc and then node dist/cli.js to run the program

# FIRST WORKING CSV MILESTONE

I have added a separate file called transactions.csv, and used the await readfile command to read it whilst witin the cli.ts file.

I also used the parse(csvText {}) to make sure it knew column headings were present (true) and to skip empty lines (true).

I then run checks on the following:

1. Description must:
    - Be Present
    - Be a string
    - Can't be blank

2. Amount must:
    - Be Present
    - Not a string
    - Can't be blank
    - Be a safe integer > 0

3. isIncome must:
    - Be an object
    - Be Present
    - Must be spelt correctly (true or false)

I ran these checks using a for of loop so it passes through each row in the imported csv, once the checks have passed per row I create 3 variables

1. amountPenceNumber where I used the Number() to convert the csv import from a string
2. trimmedDescription where I used the .trim() to cut out any whitespace around the description
3. incomeTrue where I set it = false and used an if statement to say if (row.isIncome === "true") to then make the value of incomeTrue change to true.

Once I had the 3 variables all in the correct form within the for of loop, I then used the transactions.push({}) to add those variables to the transactions empty array in the cli.ts file.

Finally, I created a const variable outside of the for loop to call the summariseTransactions function with the array that now contains the csv values and it outputted as expected.

My program now:

    Reads a file --> Parses its rows --> Checks the fields --> Builds typed transactions --> Calculates a summary