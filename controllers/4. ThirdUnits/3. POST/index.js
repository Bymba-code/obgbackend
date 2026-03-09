const { insertData } = require("../../../services/controllerService");

const POST_THIRD_UNIT = async (req, res) => {
    try {
        const {second_unit, name } = req.body;

        if(!second_unit)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "2 дахь нэгж сонгоно уу."
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
            model: "third_unit",
            data: { second_unit, name }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_THIRD_UNIT;
