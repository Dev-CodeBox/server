const jwt = require("jsonwebtoken");

const userAuthentication = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token', error: err });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed', error });
    }
}

const userAuthorization = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user || !user.role) {
            return res.status(403).json({ message: 'Forbidden: Inappropriate permissions' });
        }

        if (user.role !== "user") {
            return res.status(403).json({ message: 'Forbidden: Inappropriate permissions' });
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Inappropriate permissions', error });
    }
}

module.exports = { userAuthentication, userAuthorization };