const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const POST_BOOK_FILES = async (req, res) => {
    try {
        const { book } = req.body;

        if(!book)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ном сонгоно уу."
            })
        }
        if(!req.file)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "PDF файл оруулна уу."
            })
        }

        return insertData(res, {
            model: "book_files",
            data: { book:parseInt(book), file: `/${req?.file?.path}` }
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false, data: [], message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = POST_BOOK_FILES;