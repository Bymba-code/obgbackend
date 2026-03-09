const prismaService = require("../../../services/prismaService");

const USER_GET_ALL_NOTIFICATION = async (req, res) => {
    try {
        const user = req.user;
        const { page, limit } = req.query;

        const userSecondUnit  = user.second_unit  ? String(user.second_unit)  : null;
        const userThirdUnit   = user.third_unit   ? String(user.third_unit)   : null;
        const userFourthUnit  = user.fourth_unit  ? String(user.fourth_unit)  : null;
        const userPosition    = user.position     ? String(user.position)     : null;
        const userRank        = user.rank         ? String(user.rank)         : null;
        const userId          = Number(user.id);


        const allNotifications = await prismaService.notification.findMany({
            include: {
                notifications_visiblity_notifications_visiblity_notificationTonotification: true,
            },
            orderBy: { date: "desc" },
        });

        // Visibility шүүлт — lesson-тай яг ижил логик
        const filtered = allNotifications.filter((notification) => {
            const visibilities =
                notification.notifications_visiblity_notifications_visiblity_notificationTonotification;

            // Visibility байхгүй бол бүгдэд харагдана
            if (!visibilities || visibilities.length === 0) return true;

            return visibilities.some((vis) => {
                const target      = vis.target;
                const requirement = vis.requirement ? String(vis.requirement) : null;

                switch (target) {
                    case "second_unit":
                        if (!requirement) return userSecondUnit !== null;
                        return userSecondUnit === requirement;
                    case "third_unit":
                        if (!requirement) return userThirdUnit !== null;
                        return userThirdUnit === requirement;
                    case "fourth_unit":
                        if (!requirement) return userFourthUnit !== null;
                        return userFourthUnit === requirement;
                    case "position":
                        if (!requirement) return userPosition !== null;
                        return userPosition === requirement;
                    case "rank":
                        if (!requirement) return userRank !== null;
                        return userRank === requirement;
                    case "user":
                        return String(userId) === requirement;
                    default:
                        return false;
                }
            });
        });

        // Pagination
        const pageNum  = page  ? parseInt(page)  : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const offset   = (pageNum - 1) * limitNum;
        const paginated = filtered.slice(offset, offset + limitNum);

        // BigInt serialize
        const serialize = (data) =>
            JSON.parse(
                JSON.stringify(data, (_, value) =>
                    typeof value === "bigint" ? Number(value) : value
                )
            );

        return res.status(200).json({
            success: true,
            data:    serialize(paginated),
            count:   filtered.length,
            message: "Амжилттай.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data:    [],
            message: "Серверийн алдаа гарлаа: " + err.message,
        });
    }
};

module.exports = USER_GET_ALL_NOTIFICATION;