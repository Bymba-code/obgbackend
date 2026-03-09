const { insertData } = require("../../../services/controllerService");

const POST_TEST_ANSWERS = async (req, res) => {
    try {
        const { test, title, isSuccess } = req.body;

        if (!test) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Тест сонгоно уу."
            });
        }
        
        if(!title)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хариулт оруулна уу."
            })
        }

        return insertData(res, {
            model: "test_answers",
            data: { test:parseInt(test), title, isSuccess: isSuccess !== false ? true : false  }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_TEST_ANSWERS;
