import express from "express";
import bodyParser from "body-parser";

import cors from "cors";
import api from "./api/index.js";

import {errorHandlerMiddleware} from "./middleware/index.js";
import {customResponse} from "./utility/index.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1', api);
app.use('*', (req, res, next) => {
    res.status(404).send(customResponse({
        success: false,
        message: "Not found"
    }))
})

app.use(errorHandlerMiddleware);

export default app;