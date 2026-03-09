const prismaService = require('./prismaService'); // Зам зөв оруулна уу

const sendJSON = (res, responseObj, status = 200) => {
    const safeResponse = JSON.parse(JSON.stringify(responseObj, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
    return res.status(status).json(safeResponse);
};

const storeData = async (res, modelString, options = {}) => {
    try {

        if (!prismaService[modelString]) {
            return res.status(400).json({
                success: false,
                data: [],
                message: `'${modelString}' модел олдсонгүй.`,
                error: 'INVALID_MODEL'
            });
        }

        const {
            where = {},
            orderBy = { id: 'desc' },
            page = null,
            limit = null,
            include = null,
            select = null,
            search = null
        } = options;

        const queryOptions = {
            where: { ...where }
        };

        // Хайлтын функц нэмэх (search)
        if (search && search.fields && search.fields.length > 0 && search.value) {
            const searchConditions = search.fields.map(field => ({
                [field]: {
                    contains: search.value
                }
            }));

            queryOptions.where = {
                ...queryOptions.where,
                OR: searchConditions
            };
        }

        // OrderBy нэмэх
        if (orderBy) {
            queryOptions.orderBy = orderBy;
        }

        // Include нэмэх
        if (include) {
            queryOptions.include = include;
        }

        // Select нэмэх (select болон include хамт ашиглаж болохгүй)
        if (select && !include) {
            queryOptions.select = select;
        }

        // Pagination тохиргоо
        let pagination = null;

        if (page && limit) {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            // Утга буруу эсэхийг шалгах
            if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
                return res.status(400).json({
                    success: false,
                    data: [],
                    message: 'Хуудас ба лимит нь эерэг тоо байх ёстой.'                
                });
            }

            const skip = (pageNum - 1) * limitNum;
            queryOptions.skip = skip;
            queryOptions.take = limitNum;

            // Нийт тооллогыг авах
            const total = await prismaService[modelString].count({
                where: queryOptions.where
            });

            pagination = {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1
            };
        }

        // Датаг авах
         const data = await prismaService[modelString].findMany(queryOptions);

        const response = {
            success: true,
            data,
            count: data.length,
            message: data.length === 0 ? 'Мэдээлэл олдсонгүй.' : 'Амжилттай.'
        };

        if (pagination) response.pagination = pagination;

        return sendJSON(res, response);

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

const storeSingleData = async (res, modelString, options = {}) => {
    try {
        if (!prismaService[modelString]) {
            return sendJSON(res, {
                success: false,
                data: null,
                message: `'${modelString}' модел олдсонгүй.`,
                error: 'INVALID_MODEL'
            }, 400);
        }

        const { where = {}, include = null, select = null } = options;

        if (!where || Object.keys(where).length === 0) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: 'Хайлтын нөхцөл заавал шаардлагатай.'
            }, 400);
        }

        const queryOptions = { where: { ...where } };

        if (include) queryOptions.include = include;
        if (select && !include) queryOptions.select = select;

        const data = await prismaService[modelString].findUnique(queryOptions);

        if (!data) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: 'Мэдээлэл олдсонгүй.'
            }, 404);
        }

        return sendJSON(res, {
            success: true,
            data: data,
            message: 'Амжилттай.'
        });

    } catch (err) {
        if (err.code === 'P2025') {
            return sendJSON(res, {
                success: false,
                data: [],
                message: 'Мэдээлэл олдсонгүй.'
            }, 404);
        }

        return sendJSON(res, {
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.'
        }, 500);
    }
};

const insertData = async (res, params = {}) => {
    try {
        const { model, data, include } = params;

        if (!model) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: "Моделийн нэр оруулна уу."
            }, 400);
        }

        if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: "Өгөгдөл байхгүй эсвэл буруу байна."
            }, 400);
        }

        if (!prismaService[model]) {
            return sendJSON(res, {
                success: false,
                data: null,
                message: `'${model}' модел олдсонгүй.`
            }, 400);
        }

        const result = await prismaService[model].create({
            data,
            include
        });

        return sendJSON(res, {
            success: true,
            data: result,
            message: "Амжилттай."
        });

    } catch (err) {
        return sendJSON(res, {
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа. ' + err
        }, 500);
    }
};

const updateData = async (res, options = {}) => {
    try {
        const { 
            model, 
            whereClause = {}, 
            data = {}, 
            include = {}, 
            select = undefined,
            returnResponse = true 
        } = options;

        if (!model || !prismaService[model]) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: `Тухайн модел устсан эсвэл байхгүй байна.`
            }, 400);
        }   

        if (!whereClause || Object.keys(whereClause).length === 0) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: "Шинэчлэх бичлэгийн нөхцөл байхгүй байна."
            }, 400);
        }

        if (!data || Object.keys(data).length === 0) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: "Шинэчлэлт хийх мэдээлэл байхгүй байна."
            }, 400);
        }

        const existingRecord = await prismaService[model].findUnique({
            where: whereClause
        });

        if (!existingRecord) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: "Шинэчлэх өгөгдөл олдсонгүй."
            }, 404);
        }

        const updateOptions = {
            where: whereClause,
            data: data
        };

        const updatedData = await prismaService[model].update(updateOptions);

        if (returnResponse) {
            return sendJSON(res, {
                success: true,
                data: updatedData,
                message: "Амжилттай шинэчлэгдлээ."
            });
        }

        return updatedData;

    } catch (err) {
        return sendJSON(res, {
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа. ' + err
        }, 500);
    }
};


const deleteData = async (model, whereClause = {}, res, include = {}) => {
    try {
        if (!prismaService[model]) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: "Тухайн модел устсан эсвэл байхгүй байна."
            }, 400);
        }
        
        const data = await prismaService[model].findFirst({
            where: whereClause,
        });

        if (!data) {
            return sendJSON(res, {
                success: false,
                data: [],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            }, 404);
        }

        const deletedData = await prismaService[model].delete({
            where: whereClause,
            include,
        });

        return sendJSON(res, {
            success: true,
            data: deletedData,
            message: "Амжилттай устгалаа."
        });

    } catch (err) {
        return sendJSON(res, {
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа. ' + err
        }, 500);
    }
};


module.exports = { storeData, storeSingleData, insertData, updateData, deleteData};