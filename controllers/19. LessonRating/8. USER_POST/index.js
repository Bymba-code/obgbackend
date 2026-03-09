const { insertData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const USER_POST_LESSON_RATING = async (req, res) => {
    try {
        const user = req.user;

        const { lesson, title, content, rating} = req.body;

        if (!lesson) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хичээл оруулна уу."
            });
        }

        if(!title)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Гарчиг оруулна уу."
            })
        }
        if(!content)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Сэтгэгдэл оруулна уу."
            })
        }
        if(!rating)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Үнэлгээ оруулна уу."
            })
        }

        const existLesson = await prismaService.lesson.findUnique({
            where: {
                id: parseInt(lesson)
            }
        })

        if(!existLesson)
        {
            return res.status(404).json({
                success:false,
                data:[],
                messsage: "Хичээлийн мэдээлэл олдсонгүй."
            })
        }

        return insertData(res, {
            model: "lesson_rating",
            data: { lesson:parseInt(lesson), user:parseInt(user?.id), title, content, rating: parseInt(rating) }
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = USER_POST_LESSON_RATING;
