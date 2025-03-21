import db from '../config/db.js';

export async function getQuizData(quizId: string) {
    const { rows: quizzes, rowCount: quizzesRowCount } = await db.query(
        `
            SELECT id, title, description, creator_id, image_url, created_at, updated_at
            FROM quizzes
            WHERE id = $1;
        `,
        [quizId],
    );

    if (quizzesRowCount === 0) {
        return null;
    }

    const quiz = quizzes[0];

    const { rows: questions } = await db.query(
        `
            SELECT id, question_text, time_limit, points, question_order
            FROM questions
            WHERE quiz_id = $1
            ORDER BY question_order;
        `,
        [quizId],
    );

    for (const question of questions) {
        const { rows: answers } = await db.query(
            `
                SELECT id, answer_text, is_correct, answer_order
                FROM answers
                WHERE question_id = $1
                ORDER BY answer_order;
            `,
            [question.id],
        );
        question.answers = answers;
    }

    quiz.questions = questions;
    return quiz;
}
