const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_TEST = async (req , res) => {
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

        const { name, category } = req.body;

        let file = null;

        if(req.file)
        {
            file = `/${req.file.path}`
        }

        await updateData(res, {
            model:`test`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(name && { name: name }),
                ...(file && { img: file ? file : null }),
                ...(category && { category: parseInt(category) }),

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

module.exports = UPDATE_TEST