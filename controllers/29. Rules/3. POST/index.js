const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const POST_RULES = async (req, res) => {
    try {
        const { number, name , verified } = req.body;

        if(!number)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "№ Оруулна уу."
            })
        }
        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Нэр оруулна уу."
            })
        }
        if(!verified)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Баталгаажуулсан он сар өдөр оруулна уу."
            })
        }
        if(!req.file)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Файл оруулна уу."
            })
        }

        return insertData(res, {
            model: "rules",
            data: { number, name, verified: new Date(verified), file: `/${req?.file?.path}` }
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_RULES;