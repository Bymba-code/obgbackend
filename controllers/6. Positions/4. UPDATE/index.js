const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_POSITIONS = async (req , res) => {
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

        const {name} = req.body;

        await updateData(res, {
            model:`positions`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(name && { name: name })
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

module.exports = UPDATE_POSITIONS