const { insertData } = require("../../../services/controllerService");

const POST_PERMISSION = async (req, res) => {
    try {
        const { code, name } = req.body;

        if(!code)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Модулийн код оруулна уу."
            })
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Модулийн нэр оруулна уу."
            });
        }

        return insertData(res, {
            model: "permissions",
            data: { code, name }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_PERMISSION;
