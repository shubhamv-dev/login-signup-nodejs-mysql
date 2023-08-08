// helpers/auth.js
const jwt = require('jsonwebtoken');

// Authentication middleware
function authenticate(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'shubhamvishwakarmakannod', (error, decodedToken) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to authenticate' });
        }

        req.user = decodedToken;
        next();
    });
}

// Authorization middleware to check if the user has the required roles
function authorizeRoles(roles) {
    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    };
}

module.exports = {
    authenticate,
    authorizeRoles,
};
