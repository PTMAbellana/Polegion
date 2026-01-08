class UserMinigameAttemptController {
    constructor(userMinigameAttemptService) {
        this.userMinigameAttemptService = userMinigameAttemptService;
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const attemptData = {
                user_id: userId,
                ...req.body
            };
            const attempt = await this.userMinigameAttemptService.createUserMinigameAttempt(attemptData);
            res.status(201).json({ success: true, data: attempt });
        } catch (err) {
            console.error('Error creating minigame attempt:', err);
            res.status(400).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const attempt = await this.userMinigameAttemptService.getUserMinigameAttemptById(req.params.id);
            if (!attempt) return res.status(404).json({ error: 'Not found' });
            res.json(attempt);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const attempts = await this.userMinigameAttemptService.getAllUserMinigameAttempts();
            res.json(attempts);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const attempt = await this.userMinigameAttemptService.updateUserMinigameAttempt(req.params.id, req.body);
            if (!attempt) return res.status(404).json({ error: 'Not found' });
            res.json(attempt);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const attempt = await this.userMinigameAttemptService.deleteUserMinigameAttempt(req.params.id);
            if (!attempt) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = UserMinigameAttemptController;