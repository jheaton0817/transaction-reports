import express from "express";
import type { Request, Response } from "express";
import { parseTransactions } from "./reports/parse-transactions.js";
import { summariseTransactions } from "./reports/summary.js";
import { CsvValidationError } from "./reports/csv-validation-error.js";
import { listReports, saveReport } from "./reports/report-repository.js";

const app = express();

app.use(express.static("public"));

app.use(express.text({type: "text/csv", limit: "100kb"}));

async function receiveCsv(request: Request, response: Response) {

    if((typeof(request.body) !== "string")) {

        response.status(400);

        response.json({error: "Client must send CSV text with Content-Type: text/csv"});

        return;

    }
    
    const encodedFileName = request.get("X-File-Name");

    if(encodedFileName === undefined) {

        response.status(400);

        response.json({error: "A filename is required"});

        return;

    }

    try {

        const decodedFileName = decodeURIComponent(encodedFileName);

        const fileName = decodedFileName.trim();

        if(fileName === "") {
            response.status(400);
            response.json({error: "Filename must not be blank"});
            return;
        }
        
        const returnedTransactions = parseTransactions(request.body);

        const summarisedReturnedTransactions = summariseTransactions(returnedTransactions);

        await saveReport(fileName, summarisedReturnedTransactions.totalIncomePence, summarisedReturnedTransactions.totalExpensesPence);

        response.json(summarisedReturnedTransactions);

    }

    catch(error) {
        
        if(error instanceof CsvValidationError) {

            response.status(400);

            response.json({error: error.message});

            return;

        }

        throw error;

    }
}

function healthCheck(request: Request, response: Response) {

    response.json({status: "OK" });

}

async function getReports(request: Request, response: Response) {

    const result = await listReports();

    response.json(result);
    
}

app.get("/health", healthCheck);

app.post("/reports/summary", receiveCsv);

app.get("/reports", getReports);

app.listen(3000, "127.0.0.1");
