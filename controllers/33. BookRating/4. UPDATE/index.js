const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_BOOK_RATING = async (req , res) => {
    try 
    {
        const user = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const { title, content , rating } = req.body;

        await updateData(res, {
            model:`book_rating`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(title && { title}),
                ...(content && { content}),
                ...(rating && { rating})
            }
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа." + err
        })
    }
}

module.exports = UPDATE_BOOK_RATING