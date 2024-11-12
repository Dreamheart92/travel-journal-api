import {MongooseError} from "mongoose";
import {customResponse} from "../../utility/index.js";

export const errorHandlerMiddleware = (error, req, res, next) => {

    console.log(error);

    if (error instanceof MongooseError) {
        const errors = Object.values(error.errors).map(error => error.message);

        res.status(400).send(customResponse({
            success: false,
            message: errors,
        }))

    } else if (error.code === 11000) {
        const type = Object.keys(error.keyPattern)[0];

        res.status(409).send(customResponse({
            success: false,
            message: `${type[0].toUpperCase()}${type.slice(1)} is already registered`,
        }))
    } else {
        console.log(error);
        res.status(500).send(customResponse({
            success: false,
            message: "Internal server error"
        }))
    }
}