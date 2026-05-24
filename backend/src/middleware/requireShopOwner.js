const prisma = require('../db/prisma');

async function requireShopOwnership(req, res, next) {
    const shopId = parseInt(req.params.shopId);

    if (isNaN(shopId)) {
        return res.status(400).json({ error: 'Invalid shop ID' });
    }

    try {
        const shop = await prisma.shops.findUnique({
            where: { shop_id: shopId }
        });

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        // req.manager comes from authenticateToken middleware
        // which must always run before this one
        if (shop.manager_id !== req.manager.manager_id) {
            return res.status(403).json({ error: 'You can only manage your own shops' });
        }

        req.shop = shop; // attach shop so routes don't need to fetch it again
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = requireShopOwnership;