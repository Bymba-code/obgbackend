const { insertData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const POST_LESSON_CONTENT_IMAGE = async (req, res) => {
    try {
        const { content, title, alt } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хичээлийн контент оруулна уу."
            });
        }
        if(!req.file)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Зураг оруулна уу."
            })
        }

        const imageUrl = `/${req.file.path}`


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
            model: "lesson_content_image",
            data: { content:parseInt(content), file:imageUrl}
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_LESSON_CONTENT_IMAGE;
