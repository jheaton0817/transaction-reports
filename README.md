# WHAT WILL THE APP DO?

The app will allow a user to sign in, upload a CSV of transactions, it will process it in the background and send an email of the summary report, as well as a dashboard filled with past uploads.

# CURRENT BEHAVIOUR

Install npm ci for dependencies on a fresh checkout followed by npx tsc to compile

Save a csv to samples/ and then to run the program please input a command in the following layout:

npm run build
node dist/cli.js samples/your-file-name.csv

The last argument selects the CSV file, relative pths are resolved from the directory where you run the command.

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

# ADD LOCAL HTTP SERVER WITH A JSON HEALTH ENDPOINT

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

# Style the CSV submission page and document the interface

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

# ADDING BUTTON LOADING AND REQUEST FAILURES IN THE BROWSER

I gave the button on the form an id of submit-button, and saved it in a variable submitButton in app.js by using the document.getElementById.

Firstly after the function assures that the uploaded file isn't undefined, I set the button to be disabled ad update its' textContent to say Calculating Summary... , this is to display to the user that something is happening and doesn't allow spam click of it because they think that it doesn't work.

Then the functions main body is encased in a try block, with a catch(error) to display to try again if anything unexpected goes wrong, lastly I added a new finally block under the try and catch, and this is to reset the button to not be disabled, and revert the text back, so that even if the program exits/returns early, it resets the disabled status and textContent.