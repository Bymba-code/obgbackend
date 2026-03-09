const prismaService = require("../../../services/prismaService");

const USER_GET_DASHBOARD = async (req, res) => {
    try {
        const user = req.user;
        const { page, limit, category } = req.query;

        const userSecondUnit = user.second_unit ? String(user.second_unit) : null;
        const userThirdUnit  = user.third_unit  ? String(user.third_unit)  : null;
        const userFourthUnit = user.fourth_unit ? String(user.fourth_unit) : null;
        const userPosition   = user.position    ? String(user.position)    : null;
        const userRank       = user.rank        ? String(user.rank)        : null;
        const userId         = Number(user.id);

        // ── DB where ─────────────────────────────────────
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

        // ── Visibility шүүлт ──────────────────────────────
        const isVisible = (lesson) => {
            const visibilities = lesson.lesson_visiblity_lesson_visiblity_lessonTolesson;
            if (!visibilities || visibilities.length === 0) return true;

            return visibilities.some(vis => {
                const target      = vis.target;
                const requirement = vis.requirement ? String(vis.requirement) : null;

                switch (target) {
                    case 'second_unit':
                        return requirement ? userSecondUnit === requirement : userSecondUnit !== null;
                    case 'third_unit':
                        return requirement ? userThirdUnit  === requirement : userThirdUnit  !== null;
                    case 'fourth_unit':
                        return requirement ? userFourthUnit === requirement : userFourthUnit !== null;
                    case 'position':
                        return requirement ? userPosition   === requirement : userPosition   !== null;
                    case 'rank':
                        return requirement ? userRank       === requirement : userRank       !== null;
                    case 'user':
                        return String(userId) === requirement;
                    default:
                        return false;
                }
            });
        };

        const filteredLessons = allLessons.filter(isVisible);

        // ── Serialize + progress тооцоо ───────────────────
        const serialize = (lessons) =>
            JSON.parse(
                JSON.stringify(
                    lessons.map(lesson => {
                        const ratings  = lesson.lesson_rating_lesson_rating_lessonTolesson || [];
                        const avgRating = ratings.length > 0
                            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                            : 0;

                        const contents        = lesson.lesson_content_lesson_content_lessonTolesson || [];
                        const totalContents   = contents.length;
                        const completedContents = contents.filter(
                            c => c.user_lesson_content_progress?.[0]?.completed === true
                        ).length;
                        const progressPercent = totalContents > 0
                            ? Math.round((completedContents / totalContents) * 100)
                            : 0;

                        return {
                            ...lesson,
                            avgRating:   Math.round(avgRating * 10) / 10,
                            ratingCount: ratings.length,
                            progress: {
                                percent:     progressPercent,
                                completed:   completedContents,
                                total:       totalContents,
                                isCompleted: totalContents > 0 && progressPercent === 100,
                            },
                        };
                    }),
                    (_, value) => (typeof value === 'bigint' ? Number(value) : value)
                )
            );

        const serializedAll = serialize(filteredLessons);

        // ── Statistics ────────────────────────────────────
        // Хэрэглэгчид харагдах нийт хичээл дээр тооцно
        const stats = serializedAll.reduce(
            (acc, lesson) => {
                acc.total++;

                const { percent, total: contentCount } = lesson.progress;

                if (contentCount === 0) {
                    // контент байхгүй → эхлээгүй гэж тооцно
                    acc.notStarted++;
                } else if (percent === 100) {
                    acc.completed++;
                } else if (percent > 0) {
                    acc.inProgress++;
                } else {
                    acc.notStarted++;
                }

                // нийт дундаж явц
                acc._progressSum += percent;

                return acc;
            },
            { total: 0, completed: 0, inProgress: 0, notStarted: 0, _progressSum: 0 }
        );

        const statistics = {
            total:          stats.total,
            completed:      stats.completed,
            inProgress:     stats.inProgress,
            notStarted:     stats.notStarted,
            // дундаж явц хувь
            avgProgress:    stats.total > 0
                ? Math.round(stats._progressSum / stats.total)
                : 0,
            // дууссан хувь
            completionRate: stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0,
        };

        // ── Pagination ────────────────────────────────────
        const pageNum  = page  ? parseInt(page)  : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const offset   = (pageNum - 1) * limitNum;
        const paginated = serializedAll.slice(offset, offset + limitNum);

        return res.status(200).json({
            success:    true,
            data:       paginated,
            count:      filteredLessons.length,
            statistics,             // ← шинэ
            message:    'Амжилттай.',
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data:    [],
            message: 'Серверийн алдаа гарлаа: ' + err.message,
        });
    }
};

module.exports = USER_GET_DASHBOARD;