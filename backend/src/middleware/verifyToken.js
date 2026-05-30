import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js'

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).send({ message: "Access Denied:No Token provided" })
    }

    const actualToken = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(actualToken, ENV.JWT_SECRET);
        req.user = decoded;

        next();

    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or Expired Token!" });
    }
}

export default verifyToken;