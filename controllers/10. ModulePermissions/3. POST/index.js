const prismaService = require("../../../services/prismaService");

const POST_MODULE_PERMISSION = async (req, res) => {
    try {
        const { module, permissions } = req.body;

        if (!module) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Модуль сонгоно уу."
            });
        }

        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Нэмэх эрх сонгоно уу."
            });
        }

        const existing = await prismaService.module_permissions.findMany({
            where: {
                module: parseInt(module),
                permission: { in: permissions.map(p => parseInt(p)) }
            }
        });

        const existingPermissionIds = existing.map(e => e.permission);

        const newPermissions = permissions
            .map(p => parseInt(p))
            .filter(p => !existingPermissionIds.includes(p));

        if (newPermissions.length === 0) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Сонгосон эрхүүд аль хэдийн бүртгэлтэй байна."
            });
        }

        const result = await prismaService.module_permissions.createMany({
            data: newPermissions.map(p => ({
                module: parseInt(module),
                permission: p
            }))
        });

        return res.status(200).json({
            success: true,
            data: result,
            message: `${result.count} эрх амжилттай нэмэгдлээ.`
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа: " + err.message
        });
    }
};

module.exports = POST_MODULE_PERMISSION;