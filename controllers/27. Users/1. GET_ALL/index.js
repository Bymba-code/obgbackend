const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_ALL_USERS = async (req, res) => {
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


        const include = {
            user_first_unit:{
                    include:{
                        first_unit_user_first_unit_first_unitTofirst_unit:true
                    }
                },
                user_second_unit:{
                    include:{
                        second_unit_user_second_unit_second_unitTosecond_unit:true
                    }
                },
                user_third_unit:{
                    include:{
                        third_unit_user_third_unit_third_unitTothird_unit:true
                    }
                },
                user_fourth_unit:{
                    include:{
                        fourth_unit_user_fourth_unit_fourth_unitTofourth_unit:true
                    }
                },
                user_positions:{
                    include:{
                        positions:true
                    }
                },
                user_rank:{
                    include:{
                        rank_user_rank_rankTorank:true
                    }
                },
                user_modules:{
                    include:{
                    module_permissions:{
                        include:{
                            permissions:true,
                            modules:true
                        }
                    }
        }}};


        return await storeData(res, 'users', {
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

module.exports = GET_ALL_USERS ;