const permissionMiddleware = (module, ...requiredPermissions) => {
    return (req, res, next) => {
        try {
            const permissions = req.user?.permissions;

            if (!permissions) {
                return res.status(403).json({
                    success: false,
                    message: "Эрх олдсонгүй.",
                    code: "NO_PERMISSION"
                });
            }

            const modulePerms = permissions[module.toLowerCase()] || [];

            const hasAll = requiredPermissions.every(p => 
                modulePerms.includes(p.toLowerCase())
            );

            if (!hasAll) {
                return res.status(403).json({
                    success: false,
                    message: `Танд "${module}" модулийн шаардлагатай эрх байхгүй байна.`,
                    code: "FORBIDDEN"
                });
            }

            next();

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Серверийн алдаа: " + err.message
            });
        }
    };
};

module.exports = permissionMiddleware;