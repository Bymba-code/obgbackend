const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_LESSON_VISIBLITY = async (req , res) => {
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

        const { category, title, instructor, time, description } = req.body;

        let file = null;

        if(req.file)
        {
            file = `/${req.file.path}`
        }

        await updateData(res, {
            model:`lesson`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(category && { category: parseInt(category) }),
                ...(file && { image: file }),
                ...(title && { title: title }),
                ...(instructor && { instructor }),
                ...(time && { time: parseInt(time)}),
                ...(description && { description })
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

module.exports = UPDATE_LESSON_VISIBLITY