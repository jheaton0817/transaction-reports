const transactionForm = document.getElementById("upload-csv-file");

const uploadStatus = document.getElementById("upload-status");

const fileInput = document.getElementById("transaction-file");

const summaryResult = document.getElementById("summary-result");

const submitButton = document.getElementById("submit-button");

const moneyFormatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
});

async function handleSubmit(event) {

    event.preventDefault();
    
    summaryResult.textContent = ("");

    const selectedFile = fileInput.files[0];

    if(selectedFile === undefined) {

        uploadStatus.textContent = ("Please choose a CSV file");

        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = ("Calculating...");

    try {

        const csvText = await selectedFile.text();

        uploadStatus.textContent = ("Calculating Summary...");

        const response = await fetch ("/reports/summary", {
            method: "POST",
            headers: {
                "Content-Type": "text/csv"
            },
            body: csvText
        });

        const result = await response.json();

        if(!response.ok) {

            uploadStatus.textContent = (result.error);

            return;

        }

        summaryResult.textContent = ("Income : " + formatPence(result.totalIncomePence) + " | " + "Expenses : " + formatPence(result.totalExpensesPence) + " | " + "Balance : " + formatPence(result.balancePence));
        uploadStatus.textContent = ("Summary Ready");

    }

    catch(error) {

        uploadStatus.textContent = ("Could not complete the request. Please try again.");

    }

    finally {

        submitButton.disabled = false;

        submitButton.textContent = ("Calculate Summary");
        
    }

}

function formatPence(amountPence) {

    const pounds = (amountPence/100);

    const formattedPounds = moneyFormatter.format(pounds);

    return formattedPounds;
}

transactionForm.addEventListener("submit", handleSubmit);