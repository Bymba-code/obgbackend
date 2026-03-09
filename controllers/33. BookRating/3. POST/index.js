const { insertData } = require("../../../services/controllerService")

const POST_BOOK_RATING = async (req, res) => {
    try {
        const user = req.user
        const { book, title, content , rating } = req.body;

        if(!book)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ном сонгоно уу."
            })
        }
        if(!title)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Гарчиг оруулна уу."
            })
        }
        if(!content)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Тайлбар оруулна уу."
            })
        }
        if(!rating)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Үнэлгээ өгнө үү."
            })
        }

        return insertData(res, {
            model: "book_rating",
            data: { book:parseInt(book), user:parseInt(user?.id), title, content, rating: parseInt(rating) }
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_BOOK_RATING;