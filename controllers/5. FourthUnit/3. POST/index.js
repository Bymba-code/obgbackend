const { insertData } = require("../../../services/controllerService");

const POST_FOURTH_UNIT = async (req, res) => {
    try {
        const {third_unit, name } = req.body;

        if(!third_unit)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "3 дахь нэгж сонгоно уу."
            })
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Нэр оруулна уу."
            });
        }

        return insertData(res, {
            model: "fourth_unit",
            data: { third_unit, name }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_FOURTH_UNIT;
