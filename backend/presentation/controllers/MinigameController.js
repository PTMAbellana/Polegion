class MinigameController {
    constructor(minigameService) {
        this.minigameService = minigameService;
    }

    async create(req, res) {
        try {
            const minigame = await this.minigameService.createMinigame(req.body);
            res.status(201).json(minigame);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const minigame = await this.minigameService.getMinigameById(req.params.id);
            if (!minigame) return res.status(404).json({ error: 'Not found' });
            res.json(minigame);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const minigames = await this.minigameService.getAllMinigames();
            res.json(minigames);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getByChapterId(req, res) {
        try {
            console.log('Getting minigames for chapter:', req.params.chapterId);
            const minigames = await this.minigameService.getMinigamesByChapterId(req.params.chapterId);
            res.json({ success: true, data: minigames });
        } catch (err) {
            console.error('Error getting minigames by chapter:', err);
            res.status(400).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const minigame = await this.minigameService.updateMinigame(req.params.id, req.body);
            if (!minigame) return res.status(404).json({ error: 'Not found' });
            res.json(minigame);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const minigame = await this.minigameService.deleteMinigame(req.params.id);
            if (!minigame) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = MinigameController;