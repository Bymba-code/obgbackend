const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_ALL_NOTIFICATIONS = async (req, res) => {
    try 
    {
        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        const where = {};

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['category'], 
            value: search
        } : null;

        const data = await prismaService.notification.findFirst({
            include:{
                
            }
        })

        const include = { notifications_visiblity_notifications_visiblity_notificationTonotification:true };


        return await storeData(res, 'notification', {
            where,
            orderBy: orderByObj,
            page: page ? parseInt(page) : null,
            limit: limit ? parseInt(limit) : null,
            include,
            search: searchOptions
        });

    } 
    catch(err) 
    {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = GET_ALL_NOTIFICATIONS ;