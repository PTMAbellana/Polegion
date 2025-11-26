class CastleController {
    constructor(castleService) {
        this.castleService = castleService;
    }

    async create(req, res) {
        try {
            const castle = await this.castleService.createCastle(req.body);
            res.status(201).json(castle);
        } catch (err) {
            console.error('[CastleController] Error in create:', err);
            res.status(400).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            console.log('[CastleController] ===== GET ALL CASTLES =====');
            console.log('[CastleController] req.query:', req.query);
            console.log('[CastleController] req.params:', req.params);
            console.log('[CastleController] req.url:', req.url);
            console.log('[CastleController] req.method:', req.method);
            
            const userId = req.query?.userId;
            console.log('[CastleController] Extracted userId:', userId);
            
            if (userId) {
                console.log('[CastleController] Fetching castles with user progress for userId:', userId);
                // Get castles with user progress
                const castles = await this.castleService.getAllCastlesWithUserProgress(userId);
                console.log('[CastleController] Successfully fetched castles with progress, count:', castles?.length);
                return res.json({ success: true, data: castles });
            } else {
                console.log('[CastleController] Fetching all castles without progress');
                // Get all castles without progress
                const castles = await this.castleService.getAllCastles();
                console.log('[CastleController] Successfully fetched castles, count:', castles?.length);
                return res.json({ success: true, data: castles });
            }
        } catch (err) {
            console.error('[CastleController] ===== ERROR in getAll =====');
            console.error('[CastleController] Error message:', err.message);
            console.error('[CastleController] Error stack:', err.stack);
            res.status(400).json({ success: false, error: err.message });
        }
    }

    async getById(req, res) {
        try {
            console.log('[CastleController] getById called');
            console.log('[CastleController] req.query:', req.query);
            console.log('[CastleController] req.params:', req.params);
            
            const userId = req.query?.userId;
            
            if (userId) {
                console.log('[CastleController] Fetching castle with user progress');
                // Get castle with user progress
                const castle = await this.castleService.getCastleByIdWithUserProgress(req.params.id, userId);
                if (!castle) return res.status(404).json({ success: false, error: 'Not found' });
                return res.json({ success: true, data: castle });
            } else {
                console.log('[CastleController] Fetching castle without progress');
                // Get castle without progress
                const castle = await this.castleService.getCastleById(req.params.id);
                if (!castle) return res.status(404).json({ success: false, error: 'Not found' });
                return res.json({ success: true, data: castle });
            }
        } catch (err) {
            console.error('[CastleController] Error in getById:', err);
            res.status(400).json({ success: false, error: err.message });
        }
    }

    async update(req, res) {
        try {
            const castle = await this.castleService.updateCastle(req.params.id, req.body);
            if (!castle) return res.status(404).json({ error: 'Not found' });
            res.json(castle);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const castle = await this.castleService.deleteCastle(req.params.id);
            if (!castle) return res.status(404).json({ error: 'Not found' });
            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * Initialize user progress for a castle
     * POST /api/castles/initialize
     * Body: { userId, castleRoute }
     */
    async initializeProgress(req, res) {
        try {
            console.log('[CastleController] ===== INITIALIZE CASTLE PROGRESS =====');
            console.log('[CastleController] req.body:', req.body);
            
            const { userId, castleRoute } = req.body;
            
            if (!userId || !castleRoute) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'userId and castleRoute are required' 
                });
            }

            const data = await this.castleService.initializeUserCastleProgress(userId, castleRoute);
            
            console.log('[CastleController] Successfully initialized castle progress');
            res.json({ success: true, data });
        } catch (err) {
            console.error('[CastleController] Error in initializeProgress:', err);
            res.status(400).json({ success: false, error: err.message });
        }
    }

    /**
     * Manually seed quiz and minigame data for a specific chapter
     * POST /api/castles/seed-chapter
     * Body: { chapterId, chapterNumber, castleNumber }
     */
    async seedChapter(req, res) {
        try {
            console.log('[CastleController] ===== SEED CHAPTER DATA =====');
            console.log('[CastleController] req.body:', req.body);
            
            const { chapterId, chapterNumber, castleNumber } = req.body;
            
            if (!chapterId || !chapterNumber || !castleNumber) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'chapterId, chapterNumber, and castleNumber are required' 
                });
            }

            const result = await this.castleService.seedChapterData(chapterId, chapterNumber, castleNumber);
            
            console.log('[CastleController] Successfully seeded chapter data');
            res.json({ success: true, data: result });
        } catch (err) {
            console.error('[CastleController] Error in seedChapter:', err);
            res.status(400).json({ success: false, error: err.message });
        }
    }
}

module.exports = CastleController;