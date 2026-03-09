const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const ME_LOGOUT = async (req, res) => {
    try 
    {
        const data = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        const where = {};
        where.id = data?.id

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {
            user_modules:{
                include:{
                    module_permissions:{
                        include:{
                            permissions:true,
                            modules:true
                        }
                    }
                }
            }
        };

        // storeData-аас өгөгдөл авах
        const result = await prismaService.users.findMany({
            where,
            include,
        });

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Хэрэглэгч олдсонгүй.'
            });
        }

        const user = result[0];

        const convertBigInt = (obj) => {
            return JSON.parse(JSON.stringify(obj, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        };

        const safeResult = convertBigInt(user);

        const permissions = {};

        safeResult.user_modules.forEach((um) => {
            const moduleName = um.module_permissions?.modules?.code?.toLowerCase();
            const permissionName = um.module_permissions?.permissions?.code?.toLowerCase();

            if (moduleName && permissionName) {
                if (!permissions[moduleName]) {
                    permissions[moduleName] = [];
                }
                if (!permissions[moduleName].includes(permissionName)) {
                    permissions[moduleName].push(permissionName);
                }
            }
        });

        const { user_modules, password, ...safeUser } = safeResult;

        return res.status(200).json({
            success: true,
            data: {
                ...safeUser,
                permissions,
            },
            message: 'Амжилттай.'
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

module.exports = ME_LOGOUT;