# WHAT WILL THE APP DO?

The app will allow a user to sign in, upload a CSV of transactions, it will process it in the background and send an email of the summary report, as well as a dashboard filled with past uploads.

# CURRENT BEHAVIOUR

The app can now:

- Read a transaction CSV from the terminal or browser
- Check the CSV and calculate income, expenses and balance.
- Save a report to PostgreSQL when a browser upload succeeds.
- Display previous reports on the page, newest first.
- Keep those reports after the Node server restarts.
- Show loading, success, empty-history and failure messages.

Each saved report contains the filename, income total, expense total and creation time. The balance is calculated when reports are read.

The database does not currently store the original CSV or its individual transactions.

Accounts, background processing and email are still planned.

# INSTALL AND BUILD

From the project folder, install dependencies on a fresh checkout:

npm ci

Compile the TypeScript:

npm run build

# RUN THE BROWSER APP

The local PostgreSQL server must be running, the database and reports table must exist, and the connection settings must be in .env.

Start the server from the project folder:

node --env-file=.env dist/server.js

Open:

http://127.0.0.1:3000/

Keep the server terminal running while using the page. Press Control+C to stop it.

# RUN THE TERMINAL VERSION

node dist/cli.js samples/your-file-name.csv

The last argument chooses the file. Relative paths start from the folder where the command is run.

The terminal version calculates and prints a summary. It does not currently save a report to the database.

# CSV FORMAT

The header must match this exactly, including the order:

description,amountPence,isIncome

Amounts must be positive, safe whole numbers in pence.
isIncome must contain true or false.

# RUN THE AUTOMATED TESTS

npm test

This compiles the TypeScript first. If compilation succeeds, it runs the existing parsing and summary tests.

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

# ADDED ERRORS CHECKING - LEARNING HISTORY

Firstly I removed the bulk of cli.ts which was the parsing and validation code and wrapped it in a new function called parseTransactions into a file parse-transactions.ts.

I then exported the new parseTransactions function and call it in cli.ts.

The function firstly takes a parameter of csvText with type string and outputs Transactions[], and array of Transaction objects, the type is imported from my summary.ts file.

The function works as follows:

    - Creates a variable for the empty array called transactions
    - When parse is called to receive the text read by readFile the CSV file it also now calls a secondary function I made in parse-transactions.ts called validateHeaders, this checks each of the CSVs headers and make sure it matches the format I have chosen (i.e. correct names and correct number of headers present)
    - Once those checks pass the parseTransactions function continues checking that the CSV actually contains transactions and then continues with the rest of the checks and outputs that are described above in the FIRST WORKING CSV MILESTONE section.

In cli.ts I have wrapped everything from the file being read, calling both parseTransactions and summariseTransactions functions, as well as both the successful output message and the Transaction summary with totals printed after successful completion all within a try catch error, this was to make the error display message cli clearer and a thrown error skips the remaining statements in try and moves to catch, also added a process.exitCode = 1; so when echo $? is run it outputs 1 for an error and 0 if successfully completed.

Finally "An unexpected error has occured" message printed runs when the caught value isn't an Error object.

# CONFIGURING NPM TEST - LEARNING HISTORY

I changed the package.json file to firstly to add "build": "tsc" into the scripts section, then added the arguments to the "test" to have npm run build and then if it compiles it runs the tests at dist/reports/parse-transactions.test.js and dist/reports/summary.test.js - this changes the current command npx tsc to become npm test to both compile and run the tests.

The && is useful in the "test" because if a test runs when compilation failes, files from a previous successful build can still be there, meaning that running those tests could give me six passes while checking yesterday's code instead of my latest changes.

# ADDED ERROR TESTS - LEARNING HISTORY

I have added 6 automated tests into parse-transactions.test.ts and summary.test.ts, they do the following:

parseOutputTest:

- This makes sure that the parsed output when running the parseTransactions function outputs it in the expected format, I created a const called 'expected' and used assert.deepEqual(parsedCSV, expected); to make sure that the output of the parseTransactions function equals the expected output.

incomeErrorTest

- I used a helper function incomeErrorHelper which firstly runs parseTransactions on a csvString I created which contains the wrong spelling in the isIncome section, this is so that we expect an error message that I created, the incomeErrorTest then uses assert.throws to firstly call incomeErrorHelper and to check that it throws the expected Error message matching the error message pre-written.

emptyCSVErrorTest

- This test again uses a emptyCSVHelper function which simply runs parseTransactions on an empty string (""), so we are expecting the empty CSV error message, it is then called using assert.throws to validate that when the helper function is called it throws the error matching the empty CSV error message

All of these 3 above error tests are then run using test("expected error message", functionName); 

This test call for each is what provides the expected error thrown message when the relevant function is called.

There is then 3 tests inside of summary.test.ts

checkSummary

- This test is used to verify that the function adds multiple incomes and expenses correctly when called. I create a const array inside the function containing multiple transactions, and then call the summariseTransactions function, I then use assert.equal(transactionSummary.relevantColumn, expected value); to check that the outputs of each column are equal to the expected values.

checkEmptySummary

- This test declares an empt transactions array inside of the function and then calls the summarisetranslctions function, once again it uses assert.equal per column to make sure it meets the expected values of 0 per column due to the array being empty

checkNegativeBalance

- This test declares a const with and array of transactions that are only expenses (isIncome is false), this then runs summarisetranslctions function and calls assert.equal per column to test the expected values and the overall expected balance as negative.

All 3 test are then ran using the test("what this test does/checks", functionName);

# ADD LOCAL HTTP SERVER WITH A JSON HEALTH ENDPOINT - LEARNING HISTORY

Express is a function I can call to create my app.

Request and Response are TypeScript descriptions of the objects that the handler receives.

When a request arrives, Express supplies the actual objects:
- request contains information about what the client sent
- response gives methods for sending an answer

const app = express();

The above calls express() and stores the resulting application in app, I can then use app to register routes and start listening.

The healthCheck function takes the arguments request and response in their respective types and uses response.json(...) to send JSON to the client. Receiving this response shows that the server is reachable and can handle this route.

app.get("/health", healthCheck);

This means when a GET request arrives for /health, call the function I created called healthCheck.

Listening on an address and a port have different jobs:

127.0.0.1 means this computer - loopback address
3000 is the port that the server listens on.

The best way I learned to think about it is that imagine the address is identifying the building and the port is identifying a door into it.

The commands to start the server are:

npm run build
node dist/server.js

Then visit the health endpoint http://localhost:3000/health and you should see the JSON response, such as {"status":"OK"}

Finally, press Control+C in the servers terminal to stop it.

# Style the CSV submission page and document the interface - LEARNING HISTORY

I moved onto adding an app.js, index.html and styles.css files:

HTML - this defines the page's contents and controls.
CSS - Controls its appearance and layout
JS - Dictates how the page should act

I used Flexbox in the styles.css to stack the form controls.

Browser JavaScript submits the CSV and displays the server's response.

In app.js I firstly got the relevant elements and stored them in const variables using the document.getElementById function. This finds an element in the browser's current page.

Then I created an async function called handleSubmit. The function is an async function as it allows then to use await, await pauses that function until the awaited operation finishes.

I firstly made sure that if the uploaded file was undefined, that it would print the message "Please choose a CSV file" and return without continuing.

Once this check was passed, I updated the uploadStatus text using uploadStatus.textContent = ("updated to X status"); to say that it is calculating the summary I read the files text using await selectedFile.text() and stored it in a variable called csvText

I sent the CSV text to the server's /reports/summary endpoint using fetch. I then used await response.json() to read and reply as a JavaScript object. I then used a !response.ok check so an unsuccessful response displays the server's error message instead of totals.

This result can then be indexed as it outputs what I have had in previous renditions but in my CLI such as result.totalIncomePence.

Finally, before displaying the returned values, I used a money formatter by firstly declaring the variable:

const moneyFormatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
});

Then created a function called formatPence which takes the argument of amountPence and returns the total converted into pounds by firstly dividing by 100 and then using the moneyFormatter.format on the pence/100 value and then return that formatted string of e.g. ("12.50").

Lastly I used an empty summary-result id on the <p> inside my index.html file and used summaryResult.textContent = (""); in order to replace the text and display the final outputted values.

With the core functionality now in place, I created a styles.css file and firstly made the body use a certain font, background-color, color and then margins and padding.

Then I gave main a max-width of 680px, this limits how wide the content can go. margin: 0 auto; this was so that no matter the size of the browser it would auto adjust to centralise on the page.

I then edited the form in styles.css, most notably giving it display: flex which enables flexbox, and then flex-direction: column in order to stack it vertically.

Then made the CTA button stand out by making it blue and rounding the corners.

# ADDING BUTTON LOADING AND REQUEST FAILURES IN THE BROWSER - LEARNING HISTORY

I gave the button on the form an id of submit-button, and saved it in a variable submitButton in app.js by using the document.getElementById.

Firstly after the function assures that the uploaded file isn't undefined, I set the button to be disabled ad update its' textContent to say Calculating Summary... , this is to display to the user that something is happening and doesn't allow spam click of it because they think that it doesn't work.

Then the functions main body is encased in a try block, with a catch(error) to display to try again if anything unexpected goes wrong, lastly I added a new finally block under the try and catch, and this is to reset the button to not be disabled, and revert the text back, so that even if the program exits/returns early, it resets the disabled status and textContent.

# SAVING REPORTS AND SHOWING THEIR HISTORY - LEARNING HISTORY

# Why I added a database

Before this work, the app could calculate a summary and show it, but it could not remember previous reports.

A variable holds information while a program is running. PostgreSQL stores information separately, so stopping my Node server does not remove the saved reports.

PostgreSQL is the database server.
transaction_reports is the database I created.
reports is a table inside that database.

In my reports table, one row represents one processed CSV, not one transaction inside the CSV.

Uploading the same file twice currently creates two separate reports.

# The reports table

I saved the table definition in:

    db/migrations/001_create_reports.sql

This is a migration: a file containing instructions for changing the database structure.

Keeping this file in Git means I have the instructions needed to create the table on another computer.

The table contains:

- id: a unique whole number generated by PostgreSQL.
- file_name: the uploaded file's name.
- total_income_pence: the income total.
- total_expenses_pence: the expense total.
- created_at: when the report was created.

PRIMARY KEY identifies each row uniquely.

NOT NULL means a value cannot be missing. It does not stop a text value from being an empty string.

CHECK adds a rule. My money checks prevent negative income and expense totals. Zero is allowed because a report could contain only income or only expenses.

BIGINT stores large whole numbers. Money stays in whole pence instead of decimal pounds.

TIMESTAMPTZ stores a moment in time with time zone handling.

DEFAULT CURRENT_TIMESTAMP lets PostgreSQL supply the creation time when I do not provide one.

I do not store the balance separately. I calculate:

    total_income_pence - total_expenses_pence

This avoids storing a third total that could disagree with the other two.

# The SQL I learned

CREATE TABLE builds the table structure.

INSERT INTO adds a row.

SELECT reads information.

WHERE chooses only rows matching a condition.

ORDER BY sorts the results.

DESC means descending. For creation times, this puts newer reports first.

AS gives a result column a name. For example:

    total_income_pence - total_expenses_pence AS balance_pence

This calculates the balance and labels it balance_pence in the returned result. It does not add a stored column to the table.

If a SELECT query finds nothing, it returns zero rows. That is not automatically an error.

# Connecting Node to PostgreSQL

psql lets me talk to PostgreSQL manually from the terminal.

My Node app uses a library called pg to talk to PostgreSQL from code. This kind of library is called a database driver.

I installed:

    npm install pg
    npm install --save-dev @types/pg

pg handles the communication when the program runs.

@types/pg gives TypeScript information about how to use the library.

In src/database.ts, I created and exported one Pool.

A connection is a way for the app to talk to the database. A pool manages connections and reuses them, rather than setting up a new connection for every query.

The app shares this pool.

My small connection-check script calls pool.end() when finished. The web server keeps the pool available because more requests may arrive.

# Connection settings and .env

Environment variables are settings supplied to the program separately from its code.

My local .env file contains:

    PGHOST=127.0.0.1
    PGPORT=5432
    PGDATABASE=transaction_reports
    PGUSER=josh

PGHOST identifies the computer running PostgreSQL.
PGPORT identifies the port PostgreSQL listens on.
PGDATABASE chooses the database.
PGUSER chooses the PostgreSQL user.

These settings describe my local setup. Another computer may need different values.

Creating .env does not load it automatically. This command tells Node to load it:

    node --env-file=.env dist/server.js

.env is ignored by Git because local settings can differ between computers and may contain passwords.

Git saves my code and migration files. It does not save the report rows inside PostgreSQL.

# Keeping report SQL in one place

I created:

    src/reports/report-repository.ts

A repository here means a place containing the code that reads and saves database records.

It contains:

- listReports(): reads saved reports, newest first.
- saveReport(): saves one filename and its calculated totals.

This keeps report SQL out of the HTTP handlers. The server asks these functions to do the database work.

Neither function needs to import Express.

# async, await and Promise

Database work takes time, so these functions are async.

An async function returns a Promise: a result that may become available later, or fail.

await waits for that operation inside the current function. It does not freeze the whole server.

listReports() returns Promise<ReportRow[]>.

This means: if it succeeds, it provides an array of report rows.

saveReport() returns Promise<void>.

This means: if it succeeds, it finishes without returning a useful value. I can still await it to make sure saving finishes before continuing.

If an awaited operation fails, it throws at that point and can be handled by catch.

# Types describe values; they do not change them

ReportRow describes the shape I expect from my database query.

pool.query<ReportRow>(...) tells TypeScript what one returned row should look like.

This helps TypeScript check my code, but it does not check the actual database response at runtime.

The driver returns my BIGINT money values as strings, such as "450000".

Changing the TypeScript description to number would not convert that string.

Number("450000") performs a real conversion.

In the browser, I convert the money strings with Number(), then use formatPence() to display pounds.

The driver gives Node a Date object for created_at. When the server sends JSON, that becomes a date string.

A timestamp ending in Z is shown in UTC. Different time zone displays can describe the same moment.

# Saving values safely with placeholders

saveReport() uses $1, $2 and $3 in its SQL.

The actual filename and totals are supplied separately in an array.

$1 matches the first array item.
$2 matches the second.
$3 matches the third.

This is a parameterized query.

It keeps the SQL instructions separate from the supplied values. A filename containing an apostrophe is handled as data, rather than being joined into the SQL instructions.

PostgreSQL supplies the ID and creation time automatically.

# Sending the filename from the browser

The browser was already sending the CSV text as the request body.

I added an X-File-Name header to send the filename too.

The body contains the CSV contents. The header contains extra information about the request.

The browser uses encodeURIComponent(selectedFile.name) to encode the filename.

The server reads the header with request.get("X-File-Name"), then uses decodeURIComponent() to recover the original text.

Encoding is not encryption and is not validation.

The server checks that the header is present and that the decoded filename is not blank after trimming.

# Saving before sending success

The browser upload now follows this order:

    Check the filename
    → Parse and validate the CSV
    → Calculate the totals
    → Wait for saveReport()
    → Send the summary to the browser

receiveCsv is async because it waits for saving.

Saving happens before the success response. If saving fails, the success response is skipped.

The terminal CSV command still only calculates a summary.

# Reading history through HTTP

GET /reports calls listReports() and sends the returned rows as JSON.

GET means the client is asking to read information.

Opening /reports does not save anything. It only reads existing reports.

The browser calls this endpoint using fetch("/reports").

fetch defaults to GET when no method is specified.

response.json() reads the response body and turns the JSON into JavaScript values.

# Building the history list on the page

My HTML contains:

- A heading for previous reports.
- A history-status paragraph for messages.
- An empty report-history list.

loadReports() fetches the saved reports and builds the list.

It clears the existing list before adding items. Otherwise, loading history again would add another copy of every displayed item.

A for...of loop works through the reports.

For each report:

- document.createElement("li") creates a list item.
- textContent fills it with the filename and formatted totals.
- appendChild() places it inside the list on the page.

Creating an element does not automatically display it. It must be added to the page.

textContent displays the filename as text, not as HTML.

loadReports() runs when the page opens and after a successful upload.

This means the history updates without needing a full page refresh.

# Loading, failure and empty states

loadReports() first shows a loading message.

Inside try, it fetches the reports, checks response.ok, reads the JSON and builds the list.

fetch does not automatically throw just because the server returns HTTP 500. Checking response.ok lets me detect an unsuccessful HTTP response.

If loading fails, catch displays a history error.

The success message belongs inside try, after the work succeeds. Placing it after catch would overwrite the error message.

A failure to refresh history does not necessarily mean the upload failed. The report may already have been saved.

loadReports() handles its own errors so it does not replace a successful upload message with an upload failure message.

If reports.length is zero, the page says:

    No reports yet. Upload a CSV to get started

When an error is caught and not rethrown, the async function can finish normally. Its Promise can therefore be fulfilled even though the network request failed.

# What I checked manually

I checked that:

- A browser upload creates a saved report.
- The reports remain after restarting Node.
- Newer reports appear first.
- The page formats pence as pounds.
- History updates after an upload without refreshing the page.
- Stopping the server produces a history error message.
- Restarting it allows history to load again.
- An empty reports array produces the empty-history message.

For the empty-state check, I temporarily replaced the fetched array with [] in browser code. I then restored the real response. This did not delete database records.

My existing automated tests cover parsing and summary calculations. They do not yet automatically test the database or browser history.