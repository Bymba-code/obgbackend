const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_RULES = async (req , res) => {
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

        const { number, name , verified } = req.body;

        let file = null;

        if(req.file)
        {
            file = `/${req.file.path}`
        }

        await updateData(res, {
            model:`rules`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(number && { number }),
                ...(name && { name }),
                ...(verified && { verified: new Date(verified)}),
                ...(file && { file: file !== null ? file : null})
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

module.exports = UPDATE_RULES