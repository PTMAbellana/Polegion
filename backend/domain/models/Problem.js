class Problem {
    constructor(id, title, description, room_id, creator_id, expected_solution, difficulty = 'easy', visibility = 'show', created_at=new Date(), updated_at, max_attempts = 1, expected_xp=10){
        this.id                 = id
        this.title              = title
        this.description        = description
        this.created_at         = created_at
        this.visibility         = visibility
        this.room_id            = room_id
        this.creator_id         = creator_id
        this.expected_solution  = expected_solution
        this.difficulty         = difficulty
        this.updated_at         = updated_at
        this.max_attempts       = max_attempts
        this.expected_xp        = expected_xp
    }

    static fromDbRoom (problemData){
        return new Problem (
            problemData.id,
            problemData.title,
            problemData.description,
            problemData.room_id,
            problemData.creator_id,
            problemData.expected_solution,
            problemData.difficulty,
            problemData.visibility,
            problemData.created_at,
            problemData.updated_at,
            problemData.max_attempts,
            problemData.expected_xp
        );
    }


    toDTO(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            created_at: this.created_at,
            visibility: this.visibility,
            room_id: this.room_id,
            creator_id: this.creator_id,
            expected_solution: this.expected_solution,
            difficulty: this.difficulty,
            updated_at: this.updated_at,
            max_attempts: this.max_attempts,
            expected_xp: this.expected_xp
        }
    }
}

module.exports = Problem