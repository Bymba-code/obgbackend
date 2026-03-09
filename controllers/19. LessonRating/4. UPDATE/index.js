const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_LESSON_RATING = async (req , res) => {
    try 
    {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const { lesson, user, title, content, rating} = req.body;

        await updateData(res, {
            model:`lesson_rating`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(lesson && { lesson: parseInt(lesson) }),
                ...(user && { user: parseInt(user) }),
                ...(title && { title: title }),
                ...(content && { content: content }),
                ...(rating && { rating: parseInt(rating) }),
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

module.exports = UPDATE_LESSON_RATING