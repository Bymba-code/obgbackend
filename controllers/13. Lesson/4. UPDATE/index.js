const prismaService = require("../../../services/prismaService");

const UPDATE_LESSON = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Мэдээлэл буруу эсвэл дутуу байна."
            });
        }

        const { category, title, instructor, time, description, visibilities } = req.body;

        // ── Parse visibilities ───────────────────────────────────────
        let parsedVisibilities = null;
        if (visibilities !== undefined) {
            try {
                parsedVisibilities = typeof visibilities === "string"
                    ? JSON.parse(visibilities)
                    : visibilities;
            } catch {
                return res.status(400).json({
                    success: false,
                    data: [],
                    message: "Visibility буруу форматтай байна."
                });
            }
        }

        const lessonId = parseInt(id);

        // ── Update lesson ────────────────────────────────────────────
        const lesson = await prismaService.lesson.update({
            where: { id: lessonId },
            data: {
                ...(category    && { category:    parseInt(category) }),
                ...(req.file    && { image:       `/${req.file.path}` }),
                ...(title       && { title }),
                ...(instructor  && { instructor }),
                ...(time        && { time:        parseInt(time) }),
                ...(description && { description }),
            },
            include: {
                lesson_category: true,
                lesson_visiblity_lesson_visiblity_lessonTolesson: true,
            }
        });

        // ── Update visibilities ──────────────────────────────────────
        if (Array.isArray(parsedVisibilities)) {
            // Хуучин visibility-г устгаад дахин үүсгэнэ
            await prismaService.lesson_visiblity.deleteMany({
                where: { lesson: BigInt(lessonId) }
            });

            if (parsedVisibilities.length > 0) {
                await prismaService.lesson_visiblity.createMany({
                    data: parsedVisibilities
                        .filter(v => v.target)
                        .map(v => ({
                            lesson:      BigInt(lessonId),
                            target:      v.target,
                            requirement: v.requirement ? BigInt(v.requirement) : null,
                        }))
                });
            }
        }

        // ── Serialize BigInt → Number ────────────────────────────────
        const serialized = JSON.parse(
            JSON.stringify(lesson, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(200).json({
            success: true,
            data:    serialized,
            message: "Хичээл амжилттай шинэчлэгдлээ."
        });

    } catch (err) {
        console.error("[UPDATE_LESSON]", err);
        return res.status(500).json({
            success: false,
            data:    [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = UPDATE_LESSON;