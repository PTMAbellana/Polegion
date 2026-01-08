class Competition {
    constructor(id, title, room_id, status, current_index = 0, started_at = null, paused_at = null, created_at = null, updated_at = null) {
        this.id = id;
        this.title = title;
        this.room_id = room_id;
        this.status = status;
        this.current_index = current_index;
        this.started_at = started_at;
        this.paused_at = paused_at;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromDbCompetition(competitionData) {
        return new Competition(
            competitionData.id,
            competitionData.title,
            competitionData.room_id,
            competitionData.status,
            competitionData.current_index,
            competitionData.started_at,
            competitionData.paused_at,
            competitionData.created_at,
            competitionData.updated_at
        );
    }

    toDTO() {
        return {
            id: this.id,
            title: this.title,
            room_id: this.room_id,
            status: this.status,
        };
    }
}

module.exports = Competition;