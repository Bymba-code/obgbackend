const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_MODULE = async (req , res) => {
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

        const { code, name, isvisible } = req.body;

        await updateData(res, {
            model:`modules`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(code && { code }),
                ...(name && { name: name }),
                ...(typeof isvisible !== 'undefined' && isvisible !== null ? { isvisible: !!isvisible } : {})
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

module.exports = UPDATE_MODULE