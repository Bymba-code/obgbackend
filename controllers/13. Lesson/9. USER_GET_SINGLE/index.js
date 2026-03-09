const prismaService = require("../../../services/prismaService");

const USER_GET_SINGLE_LESSON = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        // USER_GET_ALL_LESSON-тай яг ижил хэрэглэгчийн мэдээлэл бэлтгэх
        const userId         = Number(user?.id);
        const userSecondUnit = user.second_unit  ? String(user.second_unit)  : null;
        const userThirdUnit  = user.third_unit   ? String(user.third_unit)   : null;
        const userFourthUnit = user.fourth_unit  ? String(user.fourth_unit)  : null;
        const userPosition   = user.position     ? String(user.position)     : null;
        const userRank       = user.rank         ? String(user.rank)         : null;

        const lesson = await prismaService.lesson.findUnique({
            where: { id: parseInt(id) },
            include: {
                // Visibility шалгахад хэрэгтэй
                lesson_visiblity_lesson_visiblity_lessonTolesson: true,

                lesson_rating_lesson_rating_lessonTolesson:{
                    include:{
                        users:true
                    }
                },
                _count: {
                    select: {
                        lesson_content_lesson_content_lessonTolesson: true
                    }
                },
                lesson_content_lesson_content_lessonTolesson: {
                    orderBy: { index: 'asc' },
                    include: {
                        lesson_content_video: true,
                        lesson_content_pdf: true,
                        lesson_content_image: true,
                        user_lesson_content_progress: {
                            where: { user: userId }
                        },
                        lesson_content_test: {
                            include: {
                                test_lesson_content_test_testTotest: {
                                    include: {
                                        test_answers_test_answers_testTotest: {
                                            select: {
                                                id: true,
                                                title: true,
                                                isSuccess: true
                                            }
                                        }
                                    }
                                },
                                user_lesson_content_test_answers: {
                                    where: { user: userId }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!lesson) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Хичээл олдсонгүй.'
            });
        }

        // ── Visibility шалгалт (USER_GET_ALL_LESSON-тай яг ижил логик) ────────
        const visibilities = lesson.lesson_visiblity_lesson_visiblity_lessonTolesson;

        if (visibilities && visibilities.length > 0) {
            const hasAccess = visibilities.some(vis => {
                const target      = vis.target;
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

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: 'Энэ хичээлд хандах эрх байхгүй байна.'
                });
            }
        }
        // ─────────────────────────────────────────────────────────────────────

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

        const contentsWithLock = contents.map((content, index) => {
            let isLocked = false;

            if (index === 0) {
                isLocked = false;
            } else {
                const prevContent   = contents[index - 1];
                const prevCompleted = prevContent?.user_lesson_content_progress?.[0]?.completed === true;
                isLocked = !prevCompleted;
            }

            const tests = (content.lesson_content_test || []).map(t => {
                const testData     = t.test_lesson_content_test_testTotest;
                const userAnswers  = t.user_lesson_content_test_answers || [];
                const answered     = userAnswers.length > 0;
                const correctCount = userAnswers.filter(a => a.success).length;

                return {
                    id:           t.id,
                    test_id:      t.test,
                    name:         testData?.name,
                    img:          testData?.img,
                    answered,
                    is_correct:   answered ? userAnswers.every(a => a.success) : false,
                    score:        answered ? Math.round((correctCount / userAnswers.length) * 100) : 0,
                    user_answers: userAnswers.map(a => a.user_answer),
                    answers:      (testData?.test_answers_test_answers_testTotest || []).map(a => ({
                        id:         a.id,
                        title:      a.title,
                        is_correct: answered ? a.isSuccess : undefined
                    }))
                };
            });

            return {
                id:                   content.id,
                index:                content.index,
                title:                content.title,
                isLocked,
                progress:             content.user_lesson_content_progress?.[0]?.progress  || 0,
                completed:            content.user_lesson_content_progress?.[0]?.completed || false,
                // Locked үед гарчиг/index харагдана, зөвхөн файл/тест нуугдана
                lesson_content_video: content.lesson_content_video,
                lesson_content_pdf:   content.lesson_content_pdf,
                lesson_content_image: content.lesson_content_image,
                lesson_content_test:  tests,
            };
        });

        const result = JSON.parse(JSON.stringify({
            ...lesson,
            avgRating:   Math.round(avgRating * 10) / 10,
            ratingCount: ratings.length,
            lesson_content_lesson_content_lessonTolesson: contentsWithLock,
            progress: {
                percent:     progressPercent,
                completed:   completedContents,
                total:       totalContents,
                isCompleted: totalContents > 0 && progressPercent === 100
            }
        }, (_, value) => typeof value === 'bigint' ? Number(value) : value));

        return res.status(200).json({
            success: true,
            data:    result,
            message: 'Амжилттай.'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data:    null,
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = USER_GET_SINGLE_LESSON;