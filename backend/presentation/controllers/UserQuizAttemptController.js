class UserQuizAttemptController {
    constructor(userQuizAttemptService) {
        this.userQuizAttemptService = userQuizAttemptService;
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const attemptData = {
                user_id: userId,
                ...req.body
            };
            const attempt = await this.userQuizAttemptService.createUserQuizAttempt(attemptData);
            res.status(201).json({ success: true, data: attempt });
        } catch (err) {
            console.error('Error creating quiz attempt:', err);
            res.status(400).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const attempt = await this.userQuizAttemptService.getUserQuizAttemptById(req.params.id);
            if (!attempt) return res.status(404).json({ error: 'Not found' });
            res.json(attempt);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const attempts = await this.userQuizAttemptService.getAllUserQuizAttempts();
            res.json(attempts);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const attempt = await this.userQuizAttemptService.updateUserQuizAttempt(req.params.id, req.body);
            if (!attempt) return res.status(404).json({ error: 'Not found' });
            res.json(attempt);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const attempt = await this.userQuizAttemptService.deleteUserQuizAttempt(req.params.id);
            if (!attempt) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = UserQuizAttemptController;