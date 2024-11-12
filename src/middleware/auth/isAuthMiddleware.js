import jwt from "jsonwebtoken";

export const isAuthMiddleware = async (req, res, next) => {
    const token = req.headers["authorization"];

    if (token) {
        try {
            req.userId = await jwt.verify(token, process.env.JWT_SECRET)._id;
        } catch (error) {
            // Just dont throw error and go next
        }
    }
    next();
}