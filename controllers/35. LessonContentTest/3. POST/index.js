const { insertData } = require("../../../services/controllerService");

const POST_LESSON_CONTENT_TEST = async (req, res) => {
    try {
        const { content, test } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Контент сонгоно уу."
            });
        }
        if (!test) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Тест сонгоно уу."
            });
        }

        return insertData(res, {
            model: "lesson_content_test",
            data: { content:parseInt(content), test:parseInt(test) }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_LESSON_CONTENT_TEST;
