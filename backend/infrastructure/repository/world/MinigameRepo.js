const BaseRepo = require('../BaseRepo');
const Minigame = require('../../../domain/models/world/Minigame');

class MinigameRepo extends BaseRepo {
    async createMinigame(data) {
        const insertData = {
            chapter_id: data.chapter_id,
            title: data.title,
            description: data.description,
            game_type: data.game_type,
            game_config: data.game_config,
            xp_reward: data.xp_reward,
            time_limit: data.time_limit,
            order_index: data.order_index
        };

        // Include custom ID if provided (for seeding)
        if (data.id) {
            insertData.id = data.id;
        }

        const { data: result, error } = await this.supabase
            .from('minigames')
            .insert(insertData)
            .select()
            .single();
        
        if (error) throw error;
        return Minigame.fromDatabase(result);
    }

    async getMinigameById(id) {
        const { data, error } = await this.supabase
            .from('minigames')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? Minigame.fromDatabase(data) : null;
    }

    async getMinigamesByChapterId(chapterId) {
        const { data, error } = await this.supabase
            .from('minigames')
            .select('*')
            .eq('chapter_id', chapterId)
            .order('order_index', { ascending: true });
        
        if (error) throw error;
        return data ? data.map(Minigame.fromDatabase) : [];
    }

    async getAllMinigames() {
        const { data, error } = await this.supabase
            .from('minigames')
            .select('*')
            .order('order_index', { ascending: true });
        
        if (error) throw error;
        return data ? data.map(Minigame.fromDatabase) : [];
    }

    async updateMinigame(id, updateData) {
        const { data, error } = await this.supabase
            .from('minigames')
            .update({
                title: updateData.title,
                description: updateData.description,
                game_type: updateData.game_type,
                game_config: updateData.game_config,
                xp_reward: updateData.xp_reward,
                time_limit: updateData.time_limit,
                order_index: updateData.order_index
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? Minigame.fromDatabase(data) : null;
    }

    async deleteMinigame(id) {
        const { data, error} = await this.supabase
            .from('minigames')
            .delete()
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? Minigame.fromDatabase(data) : null;
    }
}

module.exports = MinigameRepo;