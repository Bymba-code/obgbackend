const prismaService = require("../../../services/prismaService");

const GET_SINGLE_MODULE_PERMISSION = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.modules.findUnique({
            where: { id: parseInt(id) },
            include: {
                module_permissions: {
                    include: {
                        permissions: true,
                    }
                }
            }
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Мэдээлэл олдсонгүй.'
            });
        }

        const result = {
            id: data.id.toString(),
            code: data.code,
            name: data.name,
            isvisible: data.isvisible,
            permissions: data.module_permissions.map(mp => mp.permissions?.name?.toLowerCase()).filter(Boolean)
        };

        return res.status(200).json({
            success: true,
            data: result,
            message: 'Амжилттай.'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = GET_SINGLE_MODULE_PERMISSION;