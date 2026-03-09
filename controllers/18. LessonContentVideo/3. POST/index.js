const { insertData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const POST_LESSON_CONTENT_VIDEO = async (req, res) => {
    try {
        const { content, video } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хичээлийн контент оруулна уу."
            });
        }
        if(!video)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Бичлэгний URL оруулна уу."
            })
        }
        

        const existContent = await prismaService.lesson_content.findUnique({
            where: {
                id: parseInt(content)
            }
        })

        if(!existContent)
        {
            return res.status(404).json({
                success:false,
                data:[],
                messsage: "Хичээлийн контент олдсонгүй."
            })
        }

        return insertData(res, {
            model: "lesson_content_video",
            data: { content:parseInt(content), video:video }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_LESSON_CONTENT_VIDEO;
