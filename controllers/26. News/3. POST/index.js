const prismaService = require("../../../services/prismaService");

const POST_NEWS = async (req, res) => {
    try {
        const user = req.user;
        const { category, title, description, feature, visibilities } = req.body;

        // ── Validation ─────────────────────────────────────────────
        if (!category) {
            return res.status(400).json({
                success: false, data: [], message: "Ангилал сонгоно уу."
            });
        }
        if (!title) {
            return res.status(400).json({
                success: false, data: [], message: "Гарчиг оруулна уу."
            });
        }
        if (!description) {
            return res.status(400).json({
                success: false, data: [], message: "Тайлбар оруулна уу."
            });
        }

        // ── Parse visibilities ──────────────────────────────────────
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

        // ── Image ──────────────────────────────────────────────────
        const file = req.file ? `/${req.file.path}` : null;

        // ── Create news ────────────────────────────────────────────
        const news = await prismaService.news.create({
            data: {
                category:   parseInt(category),
                user:       parseInt(user?.id),
                title,
                description,
                image:      file,
                created_at: new Date(),
                feature:    feature === "true" || feature === true,
            },
            include: {
                news_category: true,
                news_visiblity_news_visiblity_newsTonews: true,
            }
        });

        // ── Create visibilities ────────────────────────────────────
        if (Array.isArray(parsedVisibilities) && parsedVisibilities.length > 0) {
            await prismaService.news_visiblity.createMany({
                data: parsedVisibilities
                    .filter(v => v.target)
                    .map(v => ({
                        news:        BigInt(news.id),
                        target:      v.target,
                        requirement: v.requirement ? v.requirement : null,
                    }))
            });
        }

        // ── Serialize BigInt → Number ──────────────────────────────
        const serialized = JSON.parse(
            JSON.stringify(news, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(201).json({
            success: true,
            data:    serialized,
            message: "Мэдээ амжилттай нэмэгдлээ."
        });

    } catch (err) {
        console.error("[POST_NEWS]", err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_NEWS;