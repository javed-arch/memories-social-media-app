import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        try {
            const isValid = jwt.verify(token, process.env.JWT);
            if (isValid) {
                req.userId = isValid?.id;
                next();
            } else {
                return res.sendStatus(401);
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        return res.sendStatus(401);
    }
};
