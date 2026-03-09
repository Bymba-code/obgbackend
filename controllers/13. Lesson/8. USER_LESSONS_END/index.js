const prismaService = require("../../../services/prismaService");

const USER_GET_LESSONS_END = async (req, res) => {
    try {
        const user = req.user;
        const { page, limit, category } = req.query;

        const userId = Number(user.id);
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const offset = (pageNum - 1) * limitNum;

        const where = {};
        if (category) where.category = parseInt(category);

        const include = {
            lesson_rating_lesson_rating_lessonTolesson: true,
            _count: {
                select: {
                    lesson_content_lesson_content_lessonTolesson: true
                }
            },
            lesson_content_lesson_content_lessonTolesson: {
                select: {
                    id: true,
                    user_lesson_content_progress: {
                        where: { user: userId },
                        select: {
                            completed: true,
                            progress: true
                        }
                    }
                }
            }
        };

        const allLessons = await prismaService.lesson.findMany({ where, include });

        // Зөвхөн 100% дууссан хичээлүүдийг шүүх
        const completedLessons = allLessons.filter(lesson => {
            const contents = lesson.lesson_content_lesson_content_lessonTolesson || [];

            // Content байхгүй бол тооцохгүй
            if (contents.length === 0) return false;

            // Бүх content дууссан байх ёстой
            return contents.every(c =>
                c.user_lesson_content_progress?.[0]?.completed === true
            );
        });

        const count = completedLessons.length;
        const paginatedLessons = completedLessons.slice(offset, offset + limitNum);

        const serializeLessons = (lessons) =>
            JSON.parse(JSON.stringify(lessons.map(lesson => {
                const ratings = lesson.lesson_rating_lesson_rating_lessonTolesson || [];
                const avgRating = ratings.length > 0
                    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                    : 0;

                const contents = lesson.lesson_content_lesson_content_lessonTolesson || [];
                const totalContents = contents.length;
                const completedContents = contents.filter(c =>
                    c.user_lesson_content_progress?.[0]?.completed === true
                ).length;

                return {
                    ...lesson,
                    avgRating: Math.round(avgRating * 10) / 10,
                    ratingCount: ratings.length,
                    progress: {
                        percent: 100,
                        completed: completedContents,
                        total: totalContents,
                        isCompleted: true
                    }
                };
            }), (_, value) => typeof value === 'bigint' ? Number(value) : value));

        return res.status(200).json({
            success: true,
            data: serializeLessons(paginatedLessons),
            count,
            message: 'Амжилттай.'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = USER_GET_LESSONS_END;