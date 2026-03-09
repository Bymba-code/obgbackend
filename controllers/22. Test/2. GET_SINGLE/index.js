const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_SINGLE_TEST = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id) };
       
        const include = {test_answers_test_answers_testTotest:true, test_category:true};

        return await storeSingleData(res, 'test', {
            where,
            include
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = GET_SINGLE_TEST;