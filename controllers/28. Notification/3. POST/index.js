const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const POST_NOTIFICATION = async (req, res) => {
    try {
        const { title, contet, visibilities } = req.body;
        // visibilities: [{ target: "second_unit", requirement: "2" }, ...]

        if (!title) {
            return res.status(400).json({
                success: false, data: [], message: "Гарчиг оруулна уу."
            });
        }
        if (!contet) {
            return res.status(400).json({
                success: false, data: [], message: "Тайлбар оруулна уу."
            });
        }

        const notiData = await prismaService.notification.create({
            data: { title, contet, date: new Date() }
        });

        // Олон visibility нэмэх
        if (Array.isArray(visibilities) && visibilities.length > 0) {
            await prismaService.notifications_visiblity.createMany({
                data: visibilities.map((v) => ({
                    notification: parseInt(notiData.id),
                    target:       v.target       || null,
                    requirement:  v.requirement  ? String(v.requirement) : null,
                }))
            });
        }

        return res.status(201).json({
            success: true,
            message: "Амжилттай",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_NOTIFICATION;