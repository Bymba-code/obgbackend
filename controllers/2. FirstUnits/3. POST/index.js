const { insertData } = require("../../../services/controllerService");

const POST_FIRST_UNIT = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Нэр оруулна уу."
            });
        }

        return insertData(res, {
            model: "first_unit",
            data: { name }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_FIRST_UNIT;
