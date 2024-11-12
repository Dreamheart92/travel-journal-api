import {customResponse} from "../../utility/index.js";

export const isOwnerMiddleware = (req, res, next) => {

    const isOwner = req.journal.author.equals(req.userId);

    if (!isOwner) {
        return res.status(401).send(customResponse({
            success: false,
            message: "Not authorized"
        }))
    }

    next();
}