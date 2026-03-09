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

        const visibilityConditions = [
            { lesson_visiblity_lesson_visiblity_lessonTolesson: { none: {} } }
        ];

        if (userSecondUnit) {
            visibilityConditions.push({
                lesson_visiblity_lesson_visiblity_lessonTolesson: {
                    some: { target: 'second_unit', OR: [{ requirement: userSecondUnit }, { requirement: null }] }
                }
            });
        }
        if (userThirdUnit) {
            visibilityConditions.push({
                lesson_visiblity_lesson_visiblity_lessonTolesson: {
                    some: { target: 'third_unit', OR: [{ requirement: userThirdUnit }, { requirement: null }] }
                }
            });
        }
        if (userFourthUnit) {
            visibilityConditions.push({
                lesson_visiblity_lesson_visiblity_lessonTolesson: {
                    some: { target: 'fourth_unit', OR: [{ requirement: userFourthUnit }, { requirement: null }] }
                }
            });
        }
        if (userPosition) {
            visibilityConditions.push({
                lesson_visiblity_lesson_visiblity_lessonTolesson: {
                    some: { target: 'position', OR: [{ requirement: userPosition }, { requirement: null }] }
                }
            });
        }
        if (userRank) {
            visibilityConditions.push({
                lesson_visiblity_lesson_visiblity_lessonTolesson: {
                    some: { target: 'rank', OR: [{ requirement: userRank }, { requirement: null }] }
                }
            });
        }
        visibilityConditions.push({
            lesson_visiblity_lesson_visiblity_lessonTolesson: {
                some: { target: 'user', requirement: String(userId) }
            }
        });

        const where = { OR: visibilityConditions };
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
                orderBy: { index: 'asc' },
                include: {
                    user_lesson_content_progress: {
                        where: { user: userId }
                    }
                }
            }
        };

        // Бүх тохирсон lesson татах
        const allLessons = await prismaService.lesson.findMany({ 
            where, 
            include,
            orderBy: { id: 'asc' }
        });

        // 100% дууссан хичээлүүдийг хасах
        const notCompletedLessons = allLessons.filter(lesson => {
            const contents = lesson.lesson_content_lesson_content_lessonTolesson || [];
            if (contents.length === 0) return true;
            return !contents.every(c =>
                c.user_lesson_content_progress?.[0]?.completed === true
            );
        });

        // Pagination
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const offset = (pageNum - 1) * limitNum;
        const paginatedLessons = notCompletedLessons.slice(offset, offset + limitNum);

        const serializeLessons = (lessons) =>
            JSON.parse(JSON.stringify(lessons.map((lesson) => {
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
                const isCompleted = totalContents > 0 && progressPercent === 100;

                const contentsWithLock = contents.map((content, contentIndex) => {
                    let isLocked = false;
                    if (contentIndex === 0) {
                        isLocked = false;
                    } else {
                        const prevContent = contents[contentIndex - 1];
                        const prevCompleted = prevContent?.user_lesson_content_progress?.[0]?.completed === true;
                        isLocked = !prevCompleted;
                    }
                    return {
                        id: content.id,
                        index: content.index,
                        title: content.title,
                        isLocked,
                        progress: content.user_lesson_content_progress?.[0]?.progress || 0,
                        completed: content.user_lesson_content_progress?.[0]?.completed || false,
                    };
                });

                return {
                    ...lesson,
                    avgRating: Math.round(avgRating * 10) / 10,
                    ratingCount: ratings.length,
                    lesson_content_lesson_content_lessonTolesson: contentsWithLock,
                    progress: {
                        percent: progressPercent,
                        completed: completedContents,
                        total: totalContents,
                        isCompleted
                    }
                };
            }), (_, value) => typeof value === 'bigint' ? Number(value) : value));

        return res.status(200).json({
            success: true,
            data: serializeLessons(paginatedLessons),
            count: notCompletedLessons.length,  // дууссаныг хасч тооцсон count
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