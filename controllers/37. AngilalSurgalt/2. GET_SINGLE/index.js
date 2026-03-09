const prismaService = require("../../../services/prismaService");

/**
 * GET /angilal-surgalt/report
 *
 * Query params (бүгд заавал биш):
 *   category     — тухайн ангилалаар шүүх
 *   sub_category — дэд ангилалаар шүүх
 *   city         — хот/аймгаар шүүх
 *   district     — дүүрэг/сумаар шүүх
 *   gender       — хүйсээр шүүх
 *   age_min      — насны доод хязгаар
 *   age_max      — насны дээд хязгаар
 *
 * Response:
 *   summary      — нийт тоо, нийт personNumber
 *   by_category  — ангилал тус бүрийн тоо, personNumber
 *   by_sub_category
 *   by_city
 *   by_district
 *   by_gender    — эрэгтэй/эмэгтэй тоо, personNumber
 *   by_age_group — 10 жилийн насны бүлгүүд
 */
const GET_ANGILAL_SURGALT_REPORT = async (req, res) => {
    try {
        const {
            category,
            sub_category,
            city,
            district,
            gender,
            age_min,
            age_max,
        } = req.query;

        /* ── WHERE filter ────────────────────────────────── */
        const where = {};
        if (category)     where.category     = category;
        if (sub_category) where.sub_category = sub_category;
        if (city)         where.city         = city;
        if (district)     where.district     = district;
        if (gender)       where.gender       = gender;
        if (age_min || age_max) {
            where.age = {};
            if (age_min) where.age.gte = parseInt(age_min);
            if (age_max) where.age.lte = parseInt(age_max);
        }

        /* ── Бүх мөр татах (тайланд pagination хэрэггүй) ── */
        const rows = await prismaService.angilal_surgalt.findMany({ where });

        const total        = rows.length;
        const totalPersons = rows.reduce((s, r) => s + (Number(r.personNumber) || 0), 0);

        /* ── Туслах group функц ──────────────────────────── */
        const groupBy = (field) => {
            const map = {};
            for (const r of rows) {
                const key = r[field] ?? "Тодорхойгүй";
                if (!map[key]) map[key] = { count: 0, personNumber: 0 };
                map[key].count++;
                map[key].personNumber += Number(r.personNumber) || 0;
            }
            return Object.entries(map)
                .map(([value, stat]) => ({ value, ...stat }))
                .sort((a, b) => b.count - a.count);
        };

        /* ── Насны бүлгүүд (10 жилээр) ──────────────────── */
        const ageGroups = {};
        for (const r of rows) {
            if (r.age == null) {
                const key = "Тодорхойгүй";
                if (!ageGroups[key]) ageGroups[key] = { count: 0, personNumber: 0 };
                ageGroups[key].count++;
                ageGroups[key].personNumber += Number(r.personNumber) || 0;
                continue;
            }
            const age   = Number(r.age);
            const lower = Math.floor(age / 10) * 10;
            const key   = `${lower}–${lower + 9}`;
            if (!ageGroups[key]) ageGroups[key] = { count: 0, personNumber: 0, min: lower };
            ageGroups[key].count++;
            ageGroups[key].personNumber += Number(r.personNumber) || 0;
        }
        const by_age_group = Object.entries(ageGroups)
            .map(([label, stat]) => ({ label, ...stat }))
            .sort((a, b) => (a.min ?? 999) - (b.min ?? 999))
            .map(({ min, ...rest }) => rest);   // min field нь зөвхөн sort-д хэрэглэгдсэн

        /* ── Response ────────────────────────────────────── */
        return res.status(200).json({
            success: true,
            data: {
                /* Нийт дүн */
                summary: {
                    total,
                    totalPersons,
                    appliedFilters: Object.keys(where).length
                        ? Object.fromEntries(
                            Object.entries(req.query).filter(([, v]) => v)
                          )
                        : null,
                },

                /* Ангилалаар */
                by_category:     groupBy("category"),

                /* Дэд ангилалаар */
                by_sub_category: groupBy("sub_category"),

                /* Хот/аймгаар */
                by_city:         groupBy("city"),

                /* Дүүрэг/сумаар */
                by_district:     groupBy("district"),

                /* Хүйсээр */
                by_gender:       groupBy("gender"),

                /* Насны бүлгүүдээр */
                by_age_group,
            },
            message: "Амжилттай.",
        });

    } catch (err) {
        console.error("[GET_ANGILAL_SURGALT_REPORT]", err);
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа.",
        });
    }
};

module.exports = GET_ANGILAL_SURGALT_REPORT;