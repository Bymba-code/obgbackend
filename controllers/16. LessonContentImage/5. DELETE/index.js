const { deleteData } = require("../../../services/controllerService")

const DELETE_LESSON_CONTENT_IMAGE = async (req , res) => {
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

        await deleteData(`lesson_content_image`, { id: parseInt(id)}, res)
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

module.exports = DELETE_LESSON_CONTENT_IMAGE