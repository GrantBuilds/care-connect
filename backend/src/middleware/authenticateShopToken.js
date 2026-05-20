const jwt = require('jsonwebtoken');

function authenticateShopToken(req, res, next) {
    const token = req.query.token; // comes from the QR code URL

    if (!token) {
        return res.status(401).json({
            error: 'No token provided. Please scan the shop QR code.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Token's shop_id must match the shopId in the URL
        // This prevents someone using shop 1's token to access shop 2
        if (decoded.shop_id !== parseInt(req.params.shopId)) {
            return res.status(403).json({
                error: 'Token does not match this shop.'
            });
        }

        req.shopId = decoded.shop_id; // attach for use in route handlers
        next();
    } catch (err) {
        return res.status(403).json({
            error: 'Invalid or expired token. Please scan the QR code again.'
        });
    }
}

module.exports = authenticateShopToken;