const { insertData } = require("../../../services/controllerService");

const POST_LESSON_VISIBLITY = async (req, res) => {
    try {
        const { lesson, target, requirement} = req.body;

        if (!lesson) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хичээл сонгоно уу."
            });
        }


        return insertData(res, {
            model: "lesson_visiblity",
            data: { lesson: parseInt(lesson), target: target ? target : null, requirement: requirement ? requirement : null}
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_LESSON_VISIBLITY
