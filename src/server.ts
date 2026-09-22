import express from "express";
import type { Request, Response } from "express";

const app = express();

function healthCheck(request: Request, response: Response) {

    response.json({status: "OK" });

}

app.get("/health", healthCheck);

app.listen(3000, "127.0.0.1");