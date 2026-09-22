# WHAT WILL THE APP DO?

The app will allow a user to sign in, upload a CSV of transactions, it will process it in the background and send an email of the summary report, as well as a dashboard filled with past uploads.

# CURRENT BEHAVIOUR

Install npm ci for dependencies on a fresh checkout followed by npx tsc to compile

Save a csv to samples/transactions.csv  and run dist/cli.js

Header must exactly match: description,amountPence,isIncome

Outputs an Error message if an error occurs, or if successful, will output a Successful validation message, along with the calculated:

    - totalIncomePence
    - totalExpensesPence
    - balancePence

# FIRST MILESTONE

Read a local transaction CSV and produce an income, expense and balance summary.

# LEARNING APPROACH

I write the code myself, I use AI only to help me explain something I don't understand, or to review my code.

# FIRST WORKING STEP - LEARNING HISTORY

It now summarises hardcoded example transactions; CSV reading is next. Both a defined type and function are exported from src/reports/summary.ts and imported into src/cli.ts.

I then checked and compiled with npx tsc and then node dist/cli.js to run the program

# FIRST WORKING CSV MILESTONE - LEARNING HISTORY

I have added a separate file called transactions.csv, and used the await readFile command to read it whilst witin the cli.ts file.

I also used the parse(csvText {}) to make sure it knew column headings were present (true) and to skip empty lines (true).

I then run checks on the following:

1. Description must:
    - Be Present
    - Be a string
    - Can't be blank

2. Amount must:
    - Be Present
    - Can't be blank
    - Be a safe integer > 0

3. isIncome must:
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

# ADDED ERRORS CHECKING - CURRENT

Firstly I removed the bulk of cli.ts which was the parsing and validation code and wrapped it in a new function called parseTransactions into a file parse-transactions.ts.

I then exported the new parseTransactions function and call it in cli.ts.

The function firstly takes a parameter of csvText with type string and outputs Transactions[], and array of Transaction objects, the type is imported from my summary.ts file.

The function works as follows:

    - Creates a variable for the empty array called transactions
    - When parse is called to receive the text read by readFile the CSV file it also now calls a secondary function I made in parse-transactions.ts called validateHeaders, this checks each of the CSVs headers and make sure it matches the format I have chosen (i.e. correct names and correct number of headers present)
    - Once those checks pass the parseTransactions function continues checking that the CSV actually contains transactions and then continues with the rest of the checks and outputs that are described above in the FIRST WORKING CSV MILESTONE section.

In cli.ts I have wrapped everything from the file being read, calling both parseTransactions and summariseTransactions functions, as well as both the successful output message and the Transaction summary with totals printed after successful completion all within a try catch error, this was to make the error display message cli clearer and a thrown error skips the remaining statements in try and moves to catch, also added a process.exitCode = 1; so when echo $? is run it outputs 1 for an error and 0 if successfully completed.

Finally "An unexpected error has occured" message printed runs when the caught value isn't an Error object.

# CONFIGURING NPM TEST

I changed the package.json file to firstly to add "build": "tsc" into the scripts section, then added the arguments to the "test" to have npm run build and then if it compiles it runs the tests at dist/reports/parse-transactions.test.js and dist/reports/summary.test.js - this changes the current command npx tsc to become npm test to both compile and run the tests.

The && is useful in the "test" because if a test runs when compilation failes, files from a previous successful build can still be there, meaning that running those tests could give me six passes while checking yesterday's code instead of my latest changes.