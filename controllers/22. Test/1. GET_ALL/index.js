const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_ALL_TEST = async (req, res) => {
    try 
    {
        const {
            page,
            limit,
            search,
            orderBy,
            order,
            category
        } = req.query;

        const where = {};

        if(category) where.category = parseInt(category)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['category'], 
            value: search
        } : null;

        const include = {test_category:true, _count:{
            include:{
                test_answers_test_answers_testTotest:true
            }
        }};


        return await storeData(res, 'test', {
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

module.exports = GET_ALL_TEST ;