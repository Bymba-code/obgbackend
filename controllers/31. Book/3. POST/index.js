const prismaService = require("../../../services/prismaService");

const POST_BOOK = async (req, res) => {
    try {
        const { category, title, description, pageNumber, visibilities } = req.body;

        if (!category) {
            return res.status(400).json({
                success: false, data: [], message: "Ангилал сонгоно уу."
            });
        }

        if (!title?.trim()) {
            return res.status(400).json({
                success: false, data: [], message: "Нэр оруулна уу."
            });
        }

        if (!description?.trim()) {
            return res.status(400).json({
                success: false, data: [], message: "Тайлбар оруулна уу."
            });
        }

        if (!pageNumber || isNaN(parseInt(pageNumber)) || parseInt(pageNumber) <= 0) {
            return res.status(400).json({
                success: false, data: [], message: "Хуудсын тоо зөв оруулна уу."
            });
        }

        if (!req.files?.file?.[0]) {
            return res.status(400).json({
                success: false, data: [], message: "Зураг оруулна уу."
            });
        }

        if (!req.files?.pdf?.[0]) {
            return res.status(400).json({
                success: false, data: [], message: "PDF файл оруулна уу."
            });
        }

        let parsedVisibilities = [];
        if (visibilities) {
            try {
                parsedVisibilities = typeof visibilities === "string"
                    ? JSON.parse(visibilities)
                    : visibilities;
            } catch {
                return res.status(400).json({
                    success: false, data: [], message: "Visibility буруу форматтай байна."
                });
            }
        }

        const imagePath = "/" + req.files.file[0].path.replace(/\\/g, "/");
        const pdfPath   = "/" + req.files.pdf[0].path.replace(/\\/g, "/");

        const book = await prismaService.books.create({
            data: {
                category:    parseInt(category),
                title:       title.trim(),
                description: description.trim(),
                pageNumber:  parseInt(pageNumber),
                image:       imagePath,
                book_files: {
                    create: { file: pdfPath }
                }
            },
            include: {
                book_files:    true,
                book_visiblity: true,
                books_category: true,
            }
        });

        // ── Create visibilities ──────────────────────────────────────
        if (Array.isArray(parsedVisibilities) && parsedVisibilities.length > 0) {
            await prismaService.book_visiblity.createMany({
                data: parsedVisibilities.map((v) => ({
                    book:        BigInt(book.id),
                    target:      v.target      || null,
                    requirement: v.requirement ? BigInt(v.requirement) : null,
                }))
            });
        }

        // ── Serialize BigInt → Number ────────────────────────────────
        const serialized = JSON.parse(
            JSON.stringify(book, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(201).json({
            success: true,
            data:    serialized,
            message: "Ном амжилттай нэмэгдлээ."
        });

    } catch (err) {
        console.error("[POST_BOOK]", err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_BOOK;