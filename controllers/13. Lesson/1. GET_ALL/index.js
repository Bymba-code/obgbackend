const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_ALL_LESSON = async (req, res) => {
    try {
        const { page, limit, search, orderBy, order, category,
                vis_target, vis_requirement } = req.query;

        // ── Where нөхцөл ────────────────────────────────────────────
        const where = {};

        if (category) {
            where.category = BigInt(category);
        }

        // ── Search: title, instructor ────────────────────────────────
        if (search) {
            where.OR = [
                { title:      { contains: search, mode: "insensitive" } },
                { instructor: { contains: search, mode: "insensitive" } },
            ];
        }

        // ── Visibility шүүлт ─────────────────────────────────────────
        // ?vis_target=rank                    → тухайн target-тэй lesson-ууд
        // ?vis_target=rank&vis_requirement=3  → target + requirement хоёулаа тохирно
        if (vis_target) {
            const visWhere = { target: vis_target };
            if (vis_requirement) visWhere.requirement = BigInt(vis_requirement);

            where.lesson_visiblity_lesson_visiblity_lessonTolesson = {
                some: visWhere
            };
        }

        // ── OrderBy ──────────────────────────────────────────────────
        const orderByObj = orderBy
            ? { [orderBy]: order || "asc" }
            : { id: "desc" };

        // ── Pagination ───────────────────────────────────────────────
        const parsedPage  = page  ? parseInt(page)  : 1;
        const parsedLimit = limit ? parseInt(limit) : 20;
        const skip = (parsedPage - 1) * parsedLimit;

        // ── Total count ──────────────────────────────────────────────
        const total = await prismaService.lesson.count({ where });

        // ── Lessons + relations ──────────────────────────────────────
        const lessons = await prismaService.lesson.findMany({
            where,
            orderBy: orderByObj,
            skip,
            take: parsedLimit,
            include: {
                // Ангилал
                lesson_category: true,

                // Content-ийн тоо (зөвхөн id авна)
                lesson_content_lesson_content_lessonTolesson: {
                    select: { id: true }
                },

                // Rating
                lesson_rating_lesson_rating_lessonTolesson: {
                    select: { rating: true }
                },

                // Visibility
                lesson_visiblity_lesson_visiblity_lessonTolesson: {
                    select: {
                        id:          true,
                        target:      true,
                        requirement: true,
                    }
                },
            }
        });

        // ── Lesson ID-нуудыг цуглуулах ───────────────────────────────
        const lessonIds = lessons.map(l => l.id);

        // ── Lesson тус бүрийн нийт content тоо (map) ────────────────
        const lessonContentCountMap = {};
        lessons.forEach(l => {
            lessonContentCountMap[String(l.id)] =
                l.lesson_content_lesson_content_lessonTolesson?.length || 0;
        });

        // ── Бүх progress row татах (progress > 0) ───────────────────
        const allProgressRows = await prismaService.user_lesson_content_progress.findMany({
            where: {
                progress: { gt: BigInt(0) },
                lesson_content: {
                    lesson: { in: lessonIds }
                }
            },
            select: {
                user:      true,
                completed: true,
                lesson_content: {
                    select: { lesson: true }
                }
            },
        });

        // ── lesson_id → user_id → { seen, completedCount } ──────────
        const userProgressMap = {};

        allProgressRows.forEach(row => {
            const lessonId = String(row.lesson_content?.lesson);
            const userId   = String(row.user);
            if (!lessonId || lessonId === "null" || !userId || userId === "null") return;

            if (!userProgressMap[lessonId])         userProgressMap[lessonId] = {};
            if (!userProgressMap[lessonId][userId])
                userProgressMap[lessonId][userId] = { seen: 0, completedCount: 0 };

            userProgressMap[lessonId][userId].seen += 1;
            if (row.completed === true)
                userProgressMap[lessonId][userId].completedCount += 1;
        });

        // ── lesson_id → activeUsers / completedUsers ─────────────────
        const activeUsersMap    = {};
        const completedUsersMap = {};

        Object.entries(userProgressMap).forEach(([lessonId, usersObj]) => {
            const totalContent = lessonContentCountMap[lessonId] || 0;
            let active = 0, completed = 0;

            Object.values(usersObj).forEach(({ seen, completedCount }) => {
                if (seen > 0) active += 1;
                if (totalContent > 0 && completedCount >= totalContent) completed += 1;
            });

            activeUsersMap[lessonId]    = active;
            completedUsersMap[lessonId] = completed;
        });

        // ── Үр дүн нэгтгэх ──────────────────────────────────────────
        const result = lessons.map(lesson => {
            const ratings      = lesson.lesson_rating_lesson_rating_lessonTolesson     || [];
            const contentItems = lesson.lesson_content_lesson_content_lessonTolesson   || [];
            const visibilities = lesson.lesson_visiblity_lesson_visiblity_lessonTolesson || [];
            const lessonIdStr  = String(lesson.id);

            const ratingCount = ratings.length;
            const avgRating   = ratingCount > 0
                ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingCount
                : 0;

            return {
                id:          Number(lesson.id),
                title:       lesson.title,
                instructor:  lesson.instructor,
                time:        lesson.time,
                description: lesson.description,
                image:       lesson.image,
                category:    Number(lesson.category),

                lesson_category: lesson.lesson_category
                    ? { id: Number(lesson.lesson_category.id), name: lesson.lesson_category.name }
                    : null,

                // Visibility жагсаалт
                lesson_visiblity: visibilities.map(v => ({
                    id:          Number(v.id),
                    target:      v.target,
                    requirement: v.requirement ? Number(v.requirement) : null,
                })),

                // Тоонууд
                contentCount:   contentItems.length,
                ratingCount,
                avgRating:      parseFloat(avgRating.toFixed(1)),
                activeUsers:    activeUsersMap[lessonIdStr]    || 0,
                completedUsers: completedUsersMap[lessonIdStr] || 0,
            };
        });

        return res.status(200).json({
            success: true,
            data:    result,
            meta: {
                total,
                page:       parsedPage,
                limit:      parsedLimit,
                totalPages: Math.ceil(total / parsedLimit),
            },
            message: "Амжилттай."
        });

    } catch (err) {
        console.error("[GET_ALL_LESSON]", err);
        return res.status(500).json({
            success: false,
            data:    [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = GET_ALL_LESSON;