const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
const authHeader = req.headers['authorization'];
if (!authHeader) return res.status(401).json({ message: 'No token' });


const parts = authHeader.split(' ');
if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid token format' });


const token = parts[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Token invalid' });
}
};