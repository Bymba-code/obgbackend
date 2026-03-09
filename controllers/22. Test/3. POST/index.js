const { insertData } = require("../../../services/controllerService");

const POST_TEST = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Нэр оруулна уу."
            });
        }
        
        if(!category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ангилал сонгоно уу."
            })
        }

        return insertData(res, {
            model: "test",
            data: { name, img: req.file ? `/${req.file.path}` : null , category: parseInt(category)  }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_TEST;
