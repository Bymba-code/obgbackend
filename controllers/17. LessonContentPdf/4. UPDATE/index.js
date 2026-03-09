const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_LESSON_CONTENT_PDF = async (req , res) => {
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

        let file = null;

        if(req.file)
        {
            file = `/${req.file.path}`
        }

        await updateData(res, {
            model:`lesson_content_pdf`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(file && { file: file }),
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

module.exports = UPDATE_LESSON_CONTENT_PDF