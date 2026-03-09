const prismaService = require("../../../services/prismaService");

const USER_GET_ALL_BOOK = async (req, res) => {
    try {
        const user = req.user;
        const { page, limit, search, orderBy, order, category } = req.query;

        const userFirstUnit   = user.first_unit   ? String(user.first_unit)   : null;
        const userSecondUnit  = user.second_unit  ? String(user.second_unit)  : null;
        const userThirdUnit   = user.third_unit   ? String(user.third_unit)   : null;
        const userFourthUnit  = user.fourth_unit  ? String(user.fourth_unit)  : null;
        const userPosition    = user.position     ? String(user.position)     : null;
        const userRank        = user.rank         ? String(user.rank)         : null;
        const userId          = Number(user.id);

        const where = {};

        if (search?.trim()) {
            where.title = { contains: search.trim() };
        }

        if (category) {
            where.category = parseInt(category);
        }

        const validOrderFields = ["title", "pageNumber", "id"];
        const orderByField     = validOrderFields.includes(orderBy) ? orderBy : "id";
        const orderDir         = order === "asc" ? "asc" : "desc";

        const allBooks = await prismaService.books.findMany({
            where,
            orderBy: { [orderByField]: orderDir },
            include: {
                books_category: { select: { id: true, name: true } },
                book_rating:    { select: { rating: true } },
                book_visiblity: true,
                book_files:     { select: { id: true, file: true } },
                user_book_progress: {
                    where:  { user: userId },
                    select: { progress: true, completed: true }
                }
            }
        });

        // 1. Visibility шүүлт — хоосон бол харагдахгүй
        const visibleBooks = allBooks.filter(book => {
            const visibilities = book.book_visiblity;

            if (!visibilities || visibilities.length === 0) return false;

            return visibilities.some(vis => {
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
        });

        // 2. 100% дууссан номнуудыг хасах
        const filteredBooks = visibleBooks.filter(book => {
            const prog = book.user_book_progress?.[0];
            if (!prog) return true;
            return !(prog.completed === true && Number(prog.progress) >= 100);
        });

        // 3. Pagination
        const pageNum   = page  ? parseInt(page)  : 1;
        const limitNum  = limit ? parseInt(limit) : 10;
        const offset    = (pageNum - 1) * limitNum;
        const paginated = filteredBooks.slice(offset, offset + limitNum);

        // 4. Serialize
        const result = paginated.map(book => {
            const ratings   = book.book_rating || [];
            const avgRating = ratings.length > 0
                ? Math.round((ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length) * 10) / 10
                : 0;

            const prog     = book.user_book_progress?.[0];
            const progress = {
                percent:     prog ? Number(prog.progress) : 0,
                completed:   prog?.completed ?? false
            };

            const { book_rating, book_visiblity, user_book_progress, ...rest } = book;

            return { ...rest, avgRating, ratingCount: ratings.length, progress };
        });

        const serialized = JSON.parse(
            JSON.stringify(result, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(200).json({
            success: true,
            data:    serialized,
            message: "Амжилттай.",
            pagination: {
                total:      filteredBooks.length,
                page:       pageNum,
                limit:      limitNum,
                totalPages: Math.ceil(filteredBooks.length / limitNum)
            }
        });

    } catch (err) {
        console.error("[USER_GET_ALL_BOOK]", err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = USER_GET_ALL_BOOK;