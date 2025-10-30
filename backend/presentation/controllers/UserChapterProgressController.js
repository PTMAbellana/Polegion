class UserChapterProgressController {
    constructor(userChapterProgressService) {
        this.userChapterProgressService = userChapterProgressService;
    }

    async create(req, res) {
        try {
            const progress = await this.userChapterProgressService.createUserChapterProgress(req.body);
            res.status(201).json(progress);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const progress = await this.userChapterProgressService.getUserChapterProgressById(req.params.id);
            if (!progress) return res.status(404).json({ error: 'Not found' });
            res.json(progress);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const progresses = await this.userChapterProgressService.getAllUserChapterProgress();
            res.json(progresses);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async awardXP(req, res) {
        try {
            console.log('Awarding XP for chapter:', req.params.chapterId);
            const { xp_amount } = req.body;
            const userId = req.user.id;
            const chapterId = req.params.chapterId;
            
            const progress = await this.userChapterProgressService.awardChapterXP(userId, chapterId, xp_amount);
            res.json({ success: true, data: progress });
        } catch (err) {
            console.error('Error awarding chapter XP:', err);
            res.status(400).json({ error: err.message });
        }
    }

    async markCompleted(req, res) {
        try {
            console.log('Marking chapter as completed:', req.params.chapterId);
            const userId = req.user.id;
            const chapterId = req.params.chapterId;
            
            const progress = await this.userChapterProgressService.markChapterCompleted(userId, chapterId);
            res.json({ success: true, data: progress });
        } catch (err) {
            console.error('Error marking chapter as completed:', err);
            res.status(400).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const progress = await this.userChapterProgressService.updateUserChapterProgress(req.params.id, req.body);
            if (!progress) return res.status(404).json({ error: 'Not found' });
            res.json(progress);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const progress = await this.userChapterProgressService.deleteUserChapterProgress(req.params.id);
            if (!progress) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = UserChapterProgressController;