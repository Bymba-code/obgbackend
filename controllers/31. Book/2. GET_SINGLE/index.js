const { storeSingleData } = require("../../../services/controllerService");

const GET_SINGLE_BOOK = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id) };
       
        const include = { books_category: { select: { id: true, name: true } },
                book_files:     { select: { id: true, file: true } },
                book_rating:    { select: { rating: true, title: true, content: true } },
                book_visiblity: true};

        return await storeSingleData(res, 'books', {
            where,
            include
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = GET_SINGLE_BOOK;