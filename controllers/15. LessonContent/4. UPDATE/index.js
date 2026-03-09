const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_LESSON_CONTENT = async (req , res) => {
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

        const { title, index } = req.body;

        await updateData(res, {
            model:`lesson_content`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(title && { title: title }),
                ...(index && { index: parseInt(index) }),
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

module.exports = UPDATE_LESSON_CONTENT