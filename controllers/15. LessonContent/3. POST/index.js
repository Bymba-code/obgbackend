const { insertData } = require("../../../services/controllerService");

const POST_LESSON_CONTENT = async (req, res) => {
    try {
        const { lesson, title, index } = req.body;

        if (!lesson) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хичээл сонгоно уу."
            });
        }
        if (!title) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Гарчиг оруулна уу."
            });
        }
        if (!index) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Дараалал оруулна уу."
            });
        }

        return insertData(res, {
            model: "lesson_content",
            data: { lesson: parseInt(lesson), title, index: parseInt(index) }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_LESSON_CONTENT;
