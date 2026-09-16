# WHAT WILL THE APP DO?

The app will allow a user to sign in, upload a CSV of transactions, it will process it in the background and send an email of the summary report, as well as a dashboard filled with past uploads.

# FIRST MILESTONE

Read a local transaction CSV and produce an income, expense and balance summary.

# LEARNING APPROACH

I write the code myself, I use AI only to help me explain something I don't understand, or to review my code.

# FIRST WORKING STEP

It now summarises hardcoded example transactions; CSV reading is next. Both a defined type and function are exported from src/reports/summary.ts and imported into ./reports/cli.ts.

I then checked and compiled with npx tsc and then node dist/cli.js to run the program