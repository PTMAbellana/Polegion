class ChapterController {
    constructor(chapterService) {
        this.chapterService = chapterService;
    }

    async create(req, res) {
        try {
            const chapter = await this.chapterService.createChapter(req.body);
            res.status(201).json(chapter);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getById(req, res) {
        try {
            const chapter = await this.chapterService.getChapterById(req.params.id);
            if (!chapter) return res.status(404).json({ error: 'Not found' });
            res.json(chapter);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const chapters = await this.chapterService.getAllChapters();
            res.json(chapters);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async getByCastleId(req, res) {
        try {
            console.log('[ChapterController] Getting chapters for castle:', req.params.castleId);
            const chapters = await this.chapterService.getChaptersByCastleId(req.params.castleId);
            res.json({ success: true, data: chapters });
        } catch (err) {
            console.error('[ChapterController] Error getting chapters by castle:', err);
            res.status(400).json({ success: false, error: err.message });
        }
    }

    async update(req, res) {
        try {
            const chapter = await this.chapterService.updateChapter(req.params.id, req.body);
            if (!chapter) return res.status(404).json({ error: 'Not found' });
            res.json(chapter);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const chapter = await this.chapterService.deleteChapter(req.params.id);
            if (!chapter) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = ChapterController;