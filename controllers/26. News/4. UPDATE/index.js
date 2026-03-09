const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_NEWS = async (req , res) => {
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

        const { category, title, description, feature} = req.body;

        let file = null;

        if(file)
        {
            file = `/${req.file.path}`
        }

        await updateData(res, {
            model:`news`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(category && { category: parseInt(category) }),
                ...(title && { title}),
                ...(description && { description}),
                ...(file && { image: file ? file : null}),
                ...(feature && { feature:feature === "true" ? true : false}),
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

module.exports = UPDATE_NEWS