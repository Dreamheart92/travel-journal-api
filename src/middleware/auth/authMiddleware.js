import jwt from "jsonwebtoken";

import {customResponse} from "../../utility/index.js";

export const authMiddleware = async (req, res, next) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).send(customResponse({
            success: false,
            message: "Not authorized"
        }))
    }
    next();
}