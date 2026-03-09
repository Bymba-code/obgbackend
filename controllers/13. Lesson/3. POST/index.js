const prismaService = require("../../../services/prismaService");

const POST_LESSON = async (req, res) => {
    try {
        const { category, title, instructor, time, description, visibilities } = req.body;

        // ── Validation ───────────────────────────────────────────────
        if (!category) {
            return res.status(400).json({
                success: false, data: [], message: "Ангилал сонгоно уу."
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false, data: [], message: "Зураг оруулна уу."
            });
        }
        if (!title) {
            return res.status(400).json({
                success: false, data: [], message: "Нэр оруулна уу."
            });
        }
        if (!instructor) {
            return res.status(400).json({
                success: false, data: [], message: "Зохиогч / багш оруулна уу."
            });
        }
        if (!time) {
            return res.status(400).json({
                success: false, data: [], message: "Хугацаа оруулна уу."
            });
        }
        if (!description) {
            return res.status(400).json({
                success: false, data: [], message: "Тайлбар оруулна уу."
            });
        }

        // ── Parse visibilities ───────────────────────────────────────
        let parsedVisibilities = [];
        if (visibilities) {
            try {
                parsedVisibilities = typeof visibilities === "string"
                    ? JSON.parse(visibilities)
                    : visibilities;
            } catch {
                return res.status(400).json({
                    success: false, data: [], message: "Visibility буруу форматтай байна."
                });
            }
        }

        const imageUrl = `/${req.file.path}`;

        // ── Create lesson ────────────────────────────────────────────
        const lesson = await prismaService.lesson.create({
            data: {
                category:   parseInt(category),
                image:      imageUrl,
                title,
                instructor,
                time:       parseInt(time),
                description,
            },
            include: {
                lesson_category:                  true,
                lesson_visiblity_lesson_visiblity_lessonTolesson: true,
            }
        });

        // ── Create visibilities ──────────────────────────────────────
        if (Array.isArray(parsedVisibilities) && parsedVisibilities.length > 0) {
            await prismaService.lesson_visiblity.createMany({
                data: parsedVisibilities
                    .filter(v => v.target)
                    .map(v => ({
                        lesson:      BigInt(lesson.id),
                        target:      v.target,
                        requirement: v.requirement ? BigInt(v.requirement) : null,
                    }))
            });
        }

        // ── Serialize BigInt → Number ────────────────────────────────
        const serialized = JSON.parse(
            JSON.stringify(lesson, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(201).json({
            success: true,
            data:    serialized,
            message: "Хичээл амжилттай нэмэгдлээ."
        });

    } catch (err) {
        console.error("[POST_LESSON]", err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_LESSON;