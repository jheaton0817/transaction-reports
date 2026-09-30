const transactionForm = document.getElementById("upload-csv-file");

const uploadStatus = document.getElementById("upload-status");

const fileInput = document.getElementById("transaction-file");

const summaryResult = document.getElementById("summary-result");

const submitButton = document.getElementById("submit-button");

const historyStatus = document.getElementById("history-status");

const reportHistory = document.getElementById("report-history");

const moneyFormatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
});

async function loadReports() {

    historyStatus.textContent = "Loading previous reports...";

    try {
    
        const response = await fetch("/reports");

        if(!response.ok) {

            throw new Error("Could not load previous reports");
        
        }

        const reports = await response.json();

        reportHistory.textContent = "";

        for(const report of reports) {

            const item = document.createElement("li");

            const incomePence = Number(report.total_income_pence);
            const expensesPence = Number(report.total_expenses_pence);
            const balancePence = Number(report.balance_pence);

            item.textContent = report.file_name + " | Income: " + formatPence(incomePence) + " | Expenses: " + formatPence(expensesPence) + " | Balance: " + formatPence(balancePence);
            reportHistory.appendChild(item);

        }

        if(reports.length === 0) {

            historyStatus.textContent = "No reports yet. Upload a CSV to get started";
        
        }

        else {

            historyStatus.textContent = "Previous reports loaded";

        }

    }

    catch(error) {

        historyStatus.textContent = "Could not load previous reports. Please try again.";

    }

}

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
                "Content-Type": "text/csv",
                "X-File-Name": encodeURIComponent(selectedFile.name)
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
        await loadReports();

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

loadReports();