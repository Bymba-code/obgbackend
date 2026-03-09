const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_MODULE_PERMISSIONS = async (req , res) => {
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

        const { permission } = req.body;

        await updateData(res, {
            model:`module_permissions`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(permission && { permission: parseInt(permission) })
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

module.exports = UPDATE_MODULE_PERMISSIONS