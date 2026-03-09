const { insertData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const POST_USER_LESSON_CONTENT_PROGRESS = async (req, res) => {
    try {
        const user = req.user;

        const { content, progress } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хичээл контент оруулна уу."
            });
        }

        const data = await prismaService.user_lesson_content_progress.findFirst({
            where: {
                user: parseInt(user?.id),
                content: parseInt(content)
            }
        });

        if (!data) {
            return insertData(res, {
                model: "user_lesson_content_progress",
                data: {
                    user: parseInt(user?.id),
                    content: parseInt(content),
                    progress: parseInt(progress),
                    completed: progress === 100 ? true : false,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
        }

        const updateData = await prismaService.user_lesson_content_progress.update({
            where: {
                id: parseInt(data?.id)
            },
            data: {
                progress: parseInt(progress),
                completed: parseInt(progress) === 100 ? true : false,
                updated_at: new Date()
            },
            select: {
                id: true,
                user: true,
                content: true,
                progress: true,
                completed: true,
            }
        });

        // BigInt-ийг Number болгон хөрвүүлэх
        const safeData = JSON.parse(
            JSON.stringify(updateData, (key, value) =>
                typeof value === "bigint" ? Number(value) : value
            )
        );

        return res.status(200).json({
            success: true,
            data: safeData,
            message: "Амжилттай."
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_USER_LESSON_CONTENT_PROGRESS;