const prismaService = require("../../../services/prismaService");

const convertBigInt = (obj) =>
    JSON.parse(JSON.stringify(obj, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
    ));

const GET_SINGLE_USERS = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const user = await prismaService.users.findUnique({
            where: { id: parseInt(id) },
            include: {
                user_first_unit: {
                    include: {
                        first_unit_user_first_unit_first_unitTofirst_unit: true
                    }
                },
                user_second_unit: {
                    include: {
                        second_unit_user_second_unit_second_unitTosecond_unit: true
                    }
                },
                user_third_unit: {
                    include: {
                        third_unit_user_third_unit_third_unitTothird_unit: true
                    }
                },
                user_fourth_unit: {
                    include: {
                        fourth_unit_user_fourth_unit_fourth_unitTofourth_unit: true
                    }
                },
                user_positions: {
                    include: {
                        positions: true
                    }
                },
                user_rank: {
                    include: {
                        rank_user_rank_rankTorank: true
                    }
                },
                user_modules: {
                    include: {
                        module_permissions: {
                            include: {
                                permissions: true,
                                modules: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Хэрэглэгч олдсонгүй.'
            });
        }


        return res.status(200).json({
            success: true,
            data: 
                convertBigInt(user)
            ,
            message: 'Амжилттай.'
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = GET_SINGLE_USERS;