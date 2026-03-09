const prismaService = require("../../../services/prismaService");

const USER_GET_SINGLE_BOOK = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Мэдээлэл буруу эсвэл дутуу байна."
            });
        }
        
        const bookId = parseInt(id);

        // ── Хэрэглэгчийн мэдээлэл ───────────────────────────────────────────
        const userFirstUnit   = user.first_unit   ? String(user.first_unit)   : null;
        const userSecondUnit  = user.second_unit  ? String(user.second_unit)  : null;
        const userThirdUnit   = user.third_unit   ? String(user.third_unit)   : null;
        const userFourthUnit  = user.fourth_unit  ? String(user.fourth_unit)  : null;
        const userPosition    = user.position     ? String(user.position)     : null;
        const userRank        = user.rank         ? String(user.rank)         : null;
        const userId          = Number(user.id);

        // ── Ном татах ────────────────────────────────────────────────────────
        const book = await prismaService.books.findUnique({
            where: { id: bookId },
            include: {
                books_category: { select: { id: true, name: true } },
                book_files:     { select: { id: true, file: true } },
                book_rating:    { select: { rating: true, title: true, content: true } },
                book_visiblity: true
            }
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Ном олдсонгүй."
            });
        }

        // ── Visibility шүүлт ─────────────────────────────────────────────────
        const visibilities = book.book_visiblity;

        // Visibility байхгүй бол бүгд харж болно
        if (visibilities && visibilities.length > 0) {
            const hasAccess = visibilities.some(vis => {
                const target      = vis.target;
                const requirement = vis.requirement ? String(vis.requirement) : null;

                switch (target) {
                    case "first_unit":
                        if (!requirement) return userFirstUnit !== null;
                        return userFirstUnit === requirement;
                    case "second_unit":
                        if (!requirement) return userSecondUnit !== null;
                        return userSecondUnit === requirement;
                    case "third_unit":
                        if (!requirement) return userThirdUnit !== null;
                        return userThirdUnit === requirement;
                    case "fourth_unit":
                        if (!requirement) return userFourthUnit !== null;
                        return userFourthUnit === requirement;
                    case "position":
                        if (!requirement) return userPosition !== null;
                        return userPosition === requirement;
                    case "rank":
                        if (!requirement) return userRank !== null;
                        return userRank === requirement;
                    case "user":
                        return String(userId) === requirement;
                    default:
                        return false;
                }
            });

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Энэ номыг үзэх эрх байхгүй байна."
                });
            }
        }

        // ── Дундаж үнэлгээ ───────────────────────────────────────────────────
        const ratings   = book.book_rating || [];
        const avgRating = ratings.length > 0
            ? Math.round((ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length) * 10) / 10
            : 0;

        const { book_visiblity, book_rating, ...rest } = book;

        const result = {
            ...rest,
            avgRating,
            ratingCount: ratings.length,
            ratings
        };

        const serialized = JSON.parse(
            JSON.stringify(result, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(200).json({
            success: true,
            data:    serialized,
            message: "Амжилттай."
        });

    } catch (err) {
        console.error("[USER_GET_SINGLE_BOOK]", err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = USER_GET_SINGLE_BOOK;