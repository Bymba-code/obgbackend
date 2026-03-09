const prismaService = require("../../../services/prismaService");

const GET_SINGLE_LESSON = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Мэдээлэл буруу эсвэл дутуу байна."
            });
        }

        const lessonId = BigInt(id);

        // ── 1. Lesson + бүх relation ─────────────────────────────────
        const lesson = await prismaService.lesson.findUnique({
            where: { id: lessonId },
            include: {
                // Ангилал
                lesson_category: true,

                // Бүх контент + дотор нь файлууд болон тест
                lesson_content_lesson_content_lessonTolesson: {
                    orderBy: { index: "asc" },
                    include: {
                        lesson_content_image: true,
                        lesson_content_pdf:   true,
                        lesson_content_video: true,
                        lesson_content_test: {
                            include: {
                                test_lesson_content_test_testTotest: {
                                    include: {
                                        test_answers_test_answers_testTotest: true,
                                    }
                                }
                            }
                        },
                    }
                },

                // Бүх үнэлгээ + хэрэглэгчийн нэр
                lesson_rating_lesson_rating_lessonTolesson: {
                    orderBy: { id: "desc" },
                    include: {
                        users: {
                            select: {
                                id:        true,
                                firstname: true,
                                lastname:  true,
                                kode:      true,
                            }
                        }
                    }
                },

                // Visibility
                lesson_visiblity_lesson_visiblity_lessonTolesson: true,
            }
        });

        if (!lesson) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Хичээл олдсонгүй."
            });
        }

        const contents = lesson.lesson_content_lesson_content_lessonTolesson || [];

        // ── 2. Content ID-нууд ───────────────────────────────────────
        const contentIds = contents.map(c => c.id);

        // ── 3. Тухайн lesson-д progress бүртгэсэн бүх хэрэглэгчид ──
        // Нэг query-д бүх content-ийн progress татна
        const allProgress = contentIds.length > 0
            ? await prismaService.user_lesson_content_progress.findMany({
                where: { content: { in: contentIds } },
                include: {
                    users: {
                        select: {
                            id:        true,
                            firstname: true,
                            lastname:  true,
                            kode:      true,
                        }
                    }
                },
                orderBy: { updated_at: "desc" }
            })
            : [];

        // ── 4. User тус бүрийн нэгтгэсэн progress ───────────────────
        // user_id → { userInfo, completedCount, totalSeen, contentProgress[] }
        const userProgressMap = {};
        const totalContent = contents.length;

        allProgress.forEach(row => {
            const uid = String(row.user);
            if (!uid || uid === "null") return;

            if (!userProgressMap[uid]) {
                userProgressMap[uid] = {
                    user:           row.users
                        ? {
                            id:        Number(row.users.id),
                            firstname: row.users.firstname,
                            lastname:  row.users.lastname,
                            kode:      row.users.kode,
                          }
                        : { id: Number(row.user) },
                    completedCount: 0,
                    seenCount:      0,
                    contentRows:    [],
                };
            }

            if ((row.progress || 0) > 0)  userProgressMap[uid].seenCount      += 1;
            if (row.completed === true)    userProgressMap[uid].completedCount += 1;

            userProgressMap[uid].contentRows.push({
                contentId:  Number(row.content),
                progress:   Number(row.progress  || 0),
                completed:  row.completed  || false,
                createdAt:  row.created_at,
                updatedAt:  row.updated_at,
            });
        });

        // ── 5. User progress жагсаалт + lesson % тооцоо ─────────────
        const userProgressList = Object.values(userProgressMap).map(u => ({
            user:           u.user,
            seenCount:      u.seenCount,
            completedCount: u.completedCount,
            totalContent,
            // Lesson дахь нийт progress хувь
            progressPercent: totalContent > 0
                ? parseFloat(((u.completedCount / totalContent) * 100).toFixed(1))
                : 0,
            isCompleted: totalContent > 0 && u.completedCount >= totalContent,
            contentRows: u.contentRows,
        }));

        // ── 6. Нийт статистик ────────────────────────────────────────
        const activeUsers    = userProgressList.filter(u => u.seenCount      > 0).length;
        const completedUsers = userProgressList.filter(u => u.isCompleted       ).length;

        // ── 7. Rating статистик ──────────────────────────────────────
        const ratings     = lesson.lesson_rating_lesson_rating_lessonTolesson || [];
        const ratingCount = ratings.length;
        const avgRating   = ratingCount > 0
            ? parseFloat(
                (ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratingCount).toFixed(1)
              )
            : 0;

        // ── 8. BigInt serialize ──────────────────────────────────────
        const serialize = (obj) =>
            JSON.parse(JSON.stringify(obj, (_, v) =>
                typeof v === "bigint" ? Number(v) : v
            ));

        const result = serialize({
            // Үндсэн мэдээлэл
            id:          lesson.id,
            title:       lesson.title,
            instructor:  lesson.instructor,
            time:        lesson.time,
            description: lesson.description,
            image:       lesson.image,
            category:    lesson.category,

            // Ангилал
            lesson_category: lesson.lesson_category,

            // Visibility
            lesson_visiblity: lesson.lesson_visiblity_lesson_visiblity_lessonTolesson,

            // Контент (index эрэмбэлэгдсэн)
            contents: contents,

            // Үнэлгээнүүд
            ratings: ratings.map(r => ({
                id:        r.id,
                title:     r.title,
                content:   r.content,
                rating:    r.rating,
                user:      r.users || null,
            })),

            // Нийт статистик
            stats: {
                totalContent,
                ratingCount,
                avgRating,
                activeUsers,       // 1+ content үзсэн
                completedUsers,    // бүгд дууссан
            },

            // Хэрэглэгч тус бүрийн progress
            userProgress: userProgressList,
        });

        return res.status(200).json({
            success: true,
            data:    result,
            message: "Амжилттай."
        });

    } catch (err) {
        console.error("[GET_SINGLE_LESSON]", err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = GET_SINGLE_LESSON;