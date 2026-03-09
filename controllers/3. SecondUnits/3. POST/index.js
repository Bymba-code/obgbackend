const { insertData } = require("../../../services/controllerService");

const POST_SECOND_UNIT = async (req, res) => {
    try {
        const {first_unit, name } = req.body;

        if(!first_unit)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Үндсэн нэгж сонгоно уу."
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
            model: "second_unit",
            data: { first_unit, name }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_SECOND_UNIT;
