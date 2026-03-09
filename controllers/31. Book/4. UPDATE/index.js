const prismaService = require("../../../services/prismaService");

const UPDATE_BOOK = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false, data: null, message: "Буруу ID байна."
            });
        }

        const bookId    = BigInt(id);
        const bookIdInt = parseInt(id); // deleteMany-д зарим тохиолдолд int хэрэгтэй

        // ── Ном байгаа эсэхийг шалгах ───────────────────────────────
        const existing = await prismaService.books.findUnique({
            where: { id: bookId }
        });

        if (!existing) {
            return res.status(404).json({
                success: false, data: null, message: "Ном олдсонгүй."
            });
        }

        const { title, description, pageNumber, category, visibilities } = req.body;

        // ── Validation ───────────────────────────────────────────────
        if (pageNumber !== undefined && (isNaN(parseInt(pageNumber)) || parseInt(pageNumber) <= 0)) {
            return res.status(400).json({
                success: false, data: null, message: "Хуудсын тоо зөв оруулна уу."
            });
        }

        // ── Parse visibilities ───────────────────────────────────────
        let parsedVisibilities = null;
        if (visibilities !== undefined) {
            try {
                parsedVisibilities = typeof visibilities === "string"
                    ? JSON.parse(visibilities)
                    : visibilities;
            } catch {
                return res.status(400).json({
                    success: false, data: null, message: "Visibility буруу форматтай байна."
                });
            }
        }

        // ── Update payload ───────────────────────────────────────────
        const updatePayload = {
            ...(title?.trim()       && { title:       title.trim()        }),
            ...(description?.trim() && { description: description.trim()  }),
            ...(pageNumber          && { pageNumber:  parseInt(pageNumber) }),
            ...(category            && { category:    parseInt(category)   }),
        };

        // Зураг
        if (req.files?.file?.[0]) {
            updatePayload.image = "/" + req.files.file[0].path.replace(/\\/g, "/");
        } else if (req.file) {
            updatePayload.image = "/" + req.file.path.replace(/\\/g, "/");
        }

        // ── PDF upsert ───────────────────────────────────────────────
        if (req.files?.pdf?.[0]) {
            const pdfPath = "/" + req.files.pdf[0].path.replace(/\\/g, "/");

            const existingFile = await prismaService.book_files.findFirst({
                where: { book: bookId }
            });

            if (existingFile) {
                await prismaService.book_files.update({
                    where: { id: existingFile.id },
                    data:  { file: pdfPath }
                });
            } else {
                await prismaService.book_files.create({
                    data: { book: bookId, file: pdfPath }
                });
            }
        }

        // ── Өөрчлөх зүйл байгаа эсэх ────────────────────────────────
        const hasUpdate = Object.keys(updatePayload).length > 0
            || !!req.files?.pdf?.[0]
            || parsedVisibilities !== null;

        if (!hasUpdate) {
            return res.status(400).json({
                success: false, data: null, message: "Өөрчлөх мэдээлэл байхгүй байна."
            });
        }

        const updated = Object.keys(updatePayload).length > 0
            ? await prismaService.books.update({
                where:   { id: bookId },
                data:    updatePayload,
                include: {
                    book_files:     true,
                    book_visiblity: true,
                    books_category: true,
                }
            })
            : await prismaService.books.findUnique({
                where:   { id: bookId },
                include: {
                    book_files:     true,
                    book_visiblity: true,
                    books_category: true,
                }
            });

        if (parsedVisibilities !== null) {
            await prismaService.$executeRaw`
                DELETE FROM book_visiblity WHERE book = ${bookId}
            `;

            if (Array.isArray(parsedVisibilities) && parsedVisibilities.length > 0) {
                const filtered = parsedVisibilities.filter(v => v.target);

                if (filtered.length > 0) {
                    await prismaService.book_visiblity.createMany({
                        data: filtered.map(v => ({
                            book:        bookId,
                            target:      v.target,
                            requirement: v.requirement ? BigInt(v.requirement) : null,
                        }))
                    });
                }
            }
        }

        // ── Serialize BigInt → Number ────────────────────────────────
        const serialized = JSON.parse(
            JSON.stringify(updated, (_, v) => typeof v === "bigint" ? Number(v) : v)
        );

        return res.status(200).json({
            success: true,
            data:    serialized,
            message: "Ном амжилттай шинэчлэгдлээ."
        });

    } catch (err) {
        console.error("[UPDATE_BOOK]", err);
        return res.status(500).json({
            success: false, data: null, message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = UPDATE_BOOK;