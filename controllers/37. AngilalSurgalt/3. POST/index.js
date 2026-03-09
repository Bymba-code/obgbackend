const { insertData } = require("../../../services/controllerService");

const POST_ANGILAL_SURGALT = async (req, res) => {
    try {
        const { category, sub_category, city, district, gender, age, personNumber } = req.body;


        return insertData(res, {
            model: "angilal_surgalt",
            data: { category, sub_category, city, district, gender, age, personNumber:parseInt(personNumber) }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_ANGILAL_SURGALT;
