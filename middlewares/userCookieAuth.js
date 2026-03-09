const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddlewareUser = async (req, res, next) => {
    try {
        const token = req.cookies.COOKIE
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Нэвтрэх шаардлагатай.",
                code: "NO_TOKEN"
            })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = decoded

        next()

    } catch (err) {

        res.clearCookie('COOKIE', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.",
                code: "TOKEN_EXPIRED"
            })
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Буруу эсвэл хүчингүй token байна.",
                code: "INVALID_TOKEN"
            })
        }

        return res.status(401).json({
            success: false,
            message: "Нэвтрэх шаардлагатай.",
            code: "AUTH_ERROR"
        })
    }
}

module.exports = authMiddlewareUser