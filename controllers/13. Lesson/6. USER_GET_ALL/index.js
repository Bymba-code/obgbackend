const prismaService = require("../../../services/prismaService");

const USER_GET_ALL_LESSON = async (req, res) => {
    try {
        const user = req.user;
        const { page, limit, category } = req.query;

        const userSecondUnit = user.second_unit ? String(user.second_unit) : null;
        const userThirdUnit = user.third_unit ? String(user.third_unit) : null;
        const userFourthUnit = user.fourth_unit ? String(user.fourth_unit) : null;
        const userPosition = user.position ? String(user.position) : null;
        const userRank = user.rank ? String(user.rank) : null;
        const userId = Number(user.id);

        // DB түвшний where
        const where = {};
        if (category) where.category = parseInt(category);

        const include = { 
            lesson_visiblity_lesson_visiblity_lessonTolesson: true,
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

        // Visibility шүүлт
        const filteredLessons = allLessons.filter(lesson => {
            const visibilities = lesson.lesson_visiblity_lesson_visiblity_lessonTolesson;

            if (!visibilities || visibilities.length === 0) return true;

            return visibilities.some(vis => {
                const target = vis.target;
                const requirement = vis.requirement ? String(vis.requirement) : null;

                switch (target) {
                    case 'second_unit':
                        if (!requirement) return userSecondUnit !== null;
                        return userSecondUnit === requirement;
                    case 'third_unit':
                        if (!requirement) return userThirdUnit !== null;
                        return userThirdUnit === requirement;
                    case 'fourth_unit':
                        if (!requirement) return userFourthUnit !== null;
                        return userFourthUnit === requirement;
                    case 'position':
                        if (!requirement) return userPosition !== null;
                        return userPosition === requirement;
                    case 'rank':
                        if (!requirement) return userRank !== null;
                        return userRank === requirement;
                    case 'user':
                        return String(userId) === requirement;
                    default:
                        return false;
                }
            });
        });

        // Pagination
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const offset = (pageNum - 1) * limitNum;
        const paginatedLessons = filteredLessons.slice(offset, offset + limitNum);

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
                const progressPercent = totalContents > 0
                    ? Math.round((completedContents / totalContents) * 100)
                    : 0;

                return {
                    ...lesson,
                    avgRating: Math.round(avgRating * 10) / 10,
                    ratingCount: ratings.length,
                    progress: {
                        percent: progressPercent,
                        completed: completedContents,
                        total: totalContents,
                        isCompleted: totalContents > 0 && progressPercent === 100
                    }
                };
            }), (_, value) => typeof value === 'bigint' ? Number(value) : value));

        return res.status(200).json({
            success: true,
            data: serializeLessons(paginatedLessons),
            count: filteredLessons.length,
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

module.exports = USER_GET_ALL_LESSON;