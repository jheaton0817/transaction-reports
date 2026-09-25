import express from "express";
import type { Request, Response } from "express";
import { parseTransactions } from "./reports/parse-transactions.js";
import { summariseTransactions } from "./reports/summary.js";
import { CsvValidationError } from "./reports/csv-validation-error.js";

const app = express();

app.use(express.static("public"));

app.use(express.text({type: "text/csv", limit: "100kb"}));

function receiveCsv(request: Request, response: Response) {

    if((typeof(request.body) !== "string")) {

        response.status(400);

        response.json({error: "Client must send CSV text with Content-Type: text/csv"});

        return;

    }
    
    try {
        
        const returnedTransactions = parseTransactions(request.body);

        const summarisedReturnedTransactions = summariseTransactions(returnedTransactions);

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

app.get("/health", healthCheck);

app.post("/reports/summary", receiveCsv);

app.listen(3000, "127.0.0.1");
