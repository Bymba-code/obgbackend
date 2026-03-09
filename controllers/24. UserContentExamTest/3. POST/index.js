const prismaService = require("../../../services/prismaService");

const serialize = (obj) =>
    JSON.parse(JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? Number(v) : v));

const POST_USER_LESSON_CONTENT_TEST = async (req, res) => {
    try {
        const user = req.user;
        const { content_id, answers } = req.body;

        if (!content_id || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const userId = Number(user?.id);
        const contentTestIds = answers.map(a => Number(a.content_test_id));

        // Аль хэдийн хариулсан эсэх шалгах
        const existing = await prismaService.user_lesson_content_test_answers.findFirst({
            where: {
                user: userId,
                content_test: { in: contentTestIds }
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Та аль хэдийн хариулсан байна.'
            });
        }

        // Сонгосон хариултуудыг татах
        const answerIds = answers.map(a => Number(a.answer_id));
        const selectedAnswers = await prismaService.test_answers.findMany({
            where: { id: { in: answerIds } }
        });

        // answer id => answer object map
        const selectedAnswerMap = {};
        selectedAnswers.forEach(a => {
            selectedAnswerMap[Number(a.id)] = a;
        });

        // content_test мэдээлэл татах (test_id авахын тулд)
        const contentTests = await prismaService.lesson_content_test.findMany({
            where: { id: { in: contentTestIds } },
            select: { id: true, test: true }
        });

        const contentTestMap = {};
        contentTests.forEach(ct => {
            contentTestMap[Number(ct.id)] = ct;
        });

        // Бүх хариултыг хадгалах
        await prismaService.user_lesson_content_test_answers.createMany({
            data: answers.map(a => {
                const selectedAnswer = selectedAnswerMap[Number(a.answer_id)];
                return {
                    user: userId,
                    content_test: Number(a.content_test_id),
                    user_answer: Number(a.answer_id),
                    success: selectedAnswer?.isSuccess === true
                };
            })
        });

        // Тест бүрийн зөв хариултуудыг татах
        const testIds = [...new Set(contentTests.map(ct => Number(ct.test)))];
        const allCorrectAnswers = await prismaService.test_answers.findMany({
            where: {
                test: { in: testIds },
                isSuccess: true
            },
            select: { id: true, test: true }
        });

        // test_id => correct answer ids map
        const correctAnswersByTest = {};
        allCorrectAnswers.forEach(a => {
            const testId = Number(a.test);
            if (!correctAnswersByTest[testId]) correctAnswersByTest[testId] = [];
            correctAnswersByTest[testId].push(Number(a.id));
        });

        // Үр дүн бүрдүүлэх
        const results = answers.map(a => {
            const ctId = Number(a.content_test_id);
            const answerId = Number(a.answer_id);
            const selectedAnswer = selectedAnswerMap[answerId];
            const ct = contentTestMap[ctId];
            const testId = Number(ct?.test);
            const isCorrect = selectedAnswer?.isSuccess === true;

            return {
                content_test_id: ctId,
                test_id: testId,
                is_correct: isCorrect,
                score: isCorrect ? 100 : 0,
                user_answer_id: answerId,
                correct_answer_ids: correctAnswersByTest[testId] || []
            };
        });

        const totalCorrect = results.filter(r => r.is_correct).length;
        const totalCount = results.length;

        // Нийт оноо (%)
        const totalScore = Math.round((totalCorrect / totalCount) * 100);

        const isCompleted = totalScore >= 70;

        const existingProgress = await prismaService.user_lesson_content_progress.findFirst({
            where: {
                user: userId,
                content: Number(content_id)
            }
        });

        if (existingProgress) {
            if (totalScore > (existingProgress.progress || 0)) {
                await prismaService.user_lesson_content_progress.update({
                    where: { id: existingProgress.id },
                    data: {
                        progress: totalScore,
                        completed: isCompleted || existingProgress.completed,
                        updated_at: new Date()
                    }
                });
            }
        } else {
            await prismaService.user_lesson_content_progress.create({
                data: {
                    user: userId,
                    content: Number(content_id),
                    progress: totalScore,
                    completed: isCompleted,
                    created_at: new Date(), 
                    updated_at: new Date()
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: serialize({
                results,
                summary: {
                    total: totalCount,
                    correct: totalCorrect,
                    wrong: totalCount - totalCorrect,
                    score: totalScore,
                    is_completed: isCompleted
                }
            }),
            message: isCompleted
                ? `${totalCorrect}/${totalCount} зөв хариуллаа. Агуулга дууссан!`
                : `${totalCorrect}/${totalCount} зөв хариуллаа. Давахад ${70 - totalScore}% дутуу байна.`
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = POST_USER_LESSON_CONTENT_TEST;