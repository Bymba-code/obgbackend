const prismaService = require("../../../services/prismaService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const LOGIN_USER = async (req, res) => {
  try {
    const { kode, password } = req.body;

    if (!kode) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Нэвтрэх код оруулна уу."
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Нууц үг оруулна уу."
      });
    }

    const data = await prismaService.users.findFirst({
      where: { kode },
      include: {
        user_modules: {
          include: {
            module_permissions: {
              include: {
                permissions: true,
                modules: true
              }
            }
          }
        },
        user_first_unit: true,
        user_fourth_unit: true,
        user_third_unit: true,
        user_second_unit: true,
        user_positions: true,
        user_rank: true
      }
    });

    if (!data) {
      return res.status(401).json({
        success: false,
        data: [],
        message: "Нэвтрэх код эсвэл нууц үг буруу байна."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        data: [],
        message: "Нэвтрэх код эсвэл нууц үг буруу байна."
      });
    }

    // BigInt-г Number болгох helper
    const toNum = (val) => (val !== undefined && val !== null ? Number(val) : null);

    // Permissions үүсгэх
    const permissions = {};
    data.user_modules.forEach((um) => {
      const moduleName = um.module_permissions?.modules?.code?.toLowerCase();
      const permissionName = um.module_permissions?.permissions?.name?.toLowerCase();

      if (moduleName && permissionName) {
        if (!permissions[moduleName]) permissions[moduleName] = [];
        if (!permissions[moduleName].includes(permissionName)) {
          permissions[moduleName].push(permissionName);
        }
      }
    });

    const tokenPayload = {
      id: toNum(data.id),
      kode: data.kode,
      lastname: data.lastname,
      permissions,
      second_unit: toNum(data?.user_second_unit[0]?.second_unit),
      third_unit: toNum(data?.user_third_unit[0]?.third_unit),
      fourth_unit: toNum(data?.user_fourth_unit[0]?.fourth_unit),
      position: toNum(data?.user_positions[0]?.position),
      rank: toNum(data?.user_rank[0]?.rank),
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.TOKEN_SECRET || "your-secret-key-change-this-in-production",
      { expiresIn: "1d" }
    );

    res.cookie("COOKIE", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      data: {
        id: toNum(data.id),
        name: data.name,
        permissions,
        second_unit: toNum(data?.user_second_unit[0]?.second_unit),
        third_unit: toNum(data?.user_third_unit[0]?.third_unit),
        fourth_unit: toNum(data?.user_fourth_unit[0]?.fourth_unit),
        position: toNum(data?.user_positions[0]?.position),
        rank: toNum(data?.user_rank[0]?.rank),
      },
      token,
      message: "Амжилттай нэвтэрлээ"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: "Серверийн алдаа гарлаа: " + err.message
    });
  }
};

module.exports = LOGIN_USER;