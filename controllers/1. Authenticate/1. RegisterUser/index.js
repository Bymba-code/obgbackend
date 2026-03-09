const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const generateStudentCode = async () => {
    try {
        const lastCourse = await prismaService.users.findFirst({
            orderBy: {
                id: 'desc'
            },
            select: {
                kode: true
            }
        });

        const basePrefix = "OB";
        const suffix = "D";
        
        if (!lastCourse || !lastCourse.kode) {
            return `${basePrefix}01${suffix}001`;
        }

        const lastCode = lastCourse.kode;
       
        const regex = /^OB(\d{2})D(\d{3})$/;
        const match = lastCode.match(regex);
        
        if (match) {
            let groupNumber = parseInt(match[1]); 
            let sequenceNumber = parseInt(match[2]); 
            
            sequenceNumber += 1;
            
            if (sequenceNumber > 999) {
                groupNumber += 1;
                sequenceNumber = 1;
            }
            
            const formattedGroup = String(groupNumber).padStart(2, '0');
            const formattedSequence = String(sequenceNumber).padStart(3, '0');
            
            return `${basePrefix}${formattedGroup}${suffix}${formattedSequence}`;
        }
        
        return `${basePrefix}01${suffix}001`;
        
    } catch (err) {
        console.error("Код үүсгэхэд алдаа:", err);
        return "OB01S001";
    }
};

const REGISTER_USER = async (req , res) => {
    try 
    {
        const { first_unit, second_unit, third_unit, fourth_unit, position, rank, firstname, lastname, phone } = req.body;

        if(!first_unit)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Үндсэн нэгж сонгоно уу."
            })
        }
        if(!second_unit)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "2 дахь нэгж сонгоно уу."
            })
        }
        if(!firstname)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Овог нэр оруулна уу."
            })
        }
        if(!lastname)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Өөрийн нэр оруулна уу."
            })
        }
        if(!phone)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Утасны дугаар оруулна уу."
            })
        }
        if(!position)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ажлын алба сонгоно уу."
            })
        }
        if(!rank)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Цол сонгоно уу."
            })
        }
        const generatedKode = await generateStudentCode();

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(generatedKode, salt)

        const userData = await prismaService.users.create({
            data:{
                firstname:firstname,
                lastname:lastname,
                phone:phone,
                kode:generatedKode,
                password:hashed,
                date: new Date()
            }
        })

        if(first_unit)
        {
            await prismaService.user_first_unit.create({
                data: { user: parseInt(userData?.id), first_unit: parseInt(first_unit), date: new Date()}
            })

        }
        if(second_unit)
        {
            await prismaService.user_second_unit.create({
                data: { user: parseInt(userData?.id), second_unit: parseInt(second_unit), date: new Date()}
            })
        }
        if(third_unit)
        {
            await prismaService.user_third_unit.create({
                data: { user: parseInt(userData?.id), third_unit: parseInt(third_unit), date: new Date()}
            })
        }
        if(fourth_unit)
        {
            await prismaService.user_fourth_unit.create({
                data: { user: parseInt(userData?.id), fourth_unit: parseInt(fourth_unit), date: new Date()}
            })
        }

        await prismaService.user_positions.create({
            data:{
                user:parseInt(userData?.id),
                position: parseInt(position),
                date:new Date()
            }
        })
        await prismaService.user_rank.create({
            data:{
                user:parseInt(userData?.id),
                rank: parseInt(rank),
                date:new Date()
            }
        })


        return res.status(201).json({
        success: true,
        message: "Амжилттай",
        data: {
            id: userData.id.toString(),
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            kode: userData.kode
        }
        })
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = REGISTER_USER