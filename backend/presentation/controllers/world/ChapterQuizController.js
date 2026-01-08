class ChapterQuizController {
    constructor(chapterQuizService) {
        this.chapterQuizService = chapterQuizService;
    }

    async create(req, res) {
        try {
            const quiz = await this.chapterQuizService.createChapterQuiz(req.body);
            res.status(201).json(quiz);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const quiz = await this.chapterQuizService.getChapterQuizById(req.params.id);
            if (!quiz) return res.status(404).json({ error: 'Not found' });
            res.json(quiz);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const quizzes = await this.chapterQuizService.getAllChapterQuizzes();
            res.json(quizzes);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getByChapterId(req, res) {
        try {
            console.log('Getting quizzes for chapter:', req.params.chapterId);
            const quizzes = await this.chapterQuizService.getChapterQuizzesByChapterId(req.params.chapterId);
            res.json({ success: true, data: quizzes });
        } catch (err) {
            console.error('Error getting quizzes by chapter:', err);
            res.status(400).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const quiz = await this.chapterQuizService.updateChapterQuiz(req.params.id, req.body);
            if (!quiz) return res.status(404).json({ error: 'Not found' });
            res.json(quiz);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const quiz = await this.chapterQuizService.deleteChapterQuiz(req.params.id);
            if (!quiz) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = ChapterQuizController;