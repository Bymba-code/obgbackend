const { insertData } = require("../../../services/controllerService");

const POST_USER_MODULE_PERMISSION = async (req, res) => {
    try {
        const { user, module_permission } = req.body;

        if(!user)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хэрэглэгч сонгоно уу."
            })
        }
        if (!module_permission) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Модуль сонгоно уу."
            });
        }

        return insertData(res, {
            model: "user_modules",
            data: { user:parseInt(user), module_permission:parseInt(module_permission) }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_USER_MODULE_PERMISSION;
