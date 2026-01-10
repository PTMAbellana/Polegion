class UserCastleProgressController {
    constructor(userCastleProgressService) {
        this.userCastleProgressService = userCastleProgressService;
    }

    async create(req, res) {
        try {
            const progress = await this.userCastleProgressService.createUserCastleProgress(req.body);
            res.status(201).json(progress);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const progress = await this.userCastleProgressService.getUserCastleProgressById(req.params.id);
            if (!progress) return res.status(404).json({ error: 'Not found' });
            res.json(progress);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const progresses = await this.userCastleProgressService.getAllUserCastleProgress();
            res.json(progresses);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const progress = await this.userCastleProgressService.updateUserCastleProgress(req.params.id, req.body);
            if (!progress) return res.status(404).json({ error: 'Not found' });
            res.json(progress);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const progress = await this.userCastleProgressService.deleteUserCastleProgress(req.params.id);
            if (!progress) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = UserCastleProgressController;