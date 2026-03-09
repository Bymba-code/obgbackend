const prismaService = require("../../../services/prismaService");

const USER_GET_ALL_END_BOOK = async (req, res) => {
    try {
        const user   = req.user;
        const userId = Number(user.id);

        const { page, limit, search, orderBy, order, category } = req.query;

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
                book_files:     { select: { id: true, file: true } },
                user_book_progress: {
                    where:  { user: userId },
                    select: { progress: true, completed: true }
                }
            }
        });

        // Зөвхөн completed=true && progress>=100 номнуудыг авна
        const filteredBooks = allBooks.filter(book => {
            const prog = book.user_book_progress?.[0];
            if (!prog) return false;
            return prog.completed === true && Number(prog.progress) >= 100;
        });

        // Pagination
        const pageNum   = page  ? parseInt(page)  : 1;
        const limitNum  = limit ? parseInt(limit) : 10;
        const offset    = (pageNum - 1) * limitNum;
        const paginated = filteredBooks.slice(offset, offset + limitNum);

        const result = paginated.map(book => {
            const ratings   = book.book_rating || [];
            const avgRating = ratings.length > 0
                ? Math.round((ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length) * 10) / 10
                : 0;

            const prog = book.user_book_progress?.[0];
            const progress = {
                percent:   Number(prog?.progress ?? 0),
                completed: prog?.completed ?? false
            };

            const { book_rating, user_book_progress, ...rest } = book;

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
        console.error("[USER_GET_ALL_END_BOOK]", err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = USER_GET_ALL_END_BOOK;