const prismaService = require("../../../services/prismaService");

const GET_ALL_BOOK = async (req, res) => {
    try {
        const { page, limit, search, orderBy, order } = req.query;

        const pageNum  = page  ? parseInt(page)  : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const skip     = (pageNum - 1) * limitNum;

        const where = {};

        if (search?.trim()) {
            where.title = { contains: search.trim() };
        }

        const validOrderFields = ["title", "pageNumber", "id"];
        const orderByField     = validOrderFields.includes(orderBy) ? orderBy : "id";
        const orderDir         = order === "asc" ? "asc" : "desc";

        const [books, total] = await Promise.all([
            prismaService.books.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { [orderByField]: orderDir },
                include: {
                    books_category: {
                        select: { id: true, name: true }
                    },
                    book_rating: {
                        select: { rating: true }
                    },
                    book_files: {
                        select: {
                            file:true
                        }
                    }
                }
            }),
            prismaService.books.count({ where })
        ]);

        const result = books.map(book => {
            const ratings   = book.book_rating || [];
            const avgRating = ratings.length > 0
                ? Math.round((ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length) * 10) / 10
                : 0;

            const { book_rating, ...rest } = book;

            return {
                ...rest,
                avgRating,
                ratingCount: ratings.length
            };
        });

        const serialized = JSON.parse(
            JSON.stringify(result, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(200).json({
            success: true,
            data:    serialized,
            message: "Амжилттай.",
            pagination: {
                total,
                page:       pageNum,
                limit:      limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (err) {
        console.error("[GET_ALL_BOOK]", err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = GET_ALL_BOOK;