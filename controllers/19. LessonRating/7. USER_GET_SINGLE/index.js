const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const USER_GET_SINGLE_LESSON_RATING = async (req, res) => {
    try {
        const user = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id), user: parseInt(user?.id) };
       
        const include = {};

        return await storeSingleData(res, 'lesson_rating', {
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

module.exports = USER_GET_SINGLE_LESSON_RATING;