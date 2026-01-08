class Problem {
    constructor(id, title, description, room_id, creator_id, expected_solution, difficulty = 'easy', visibility = 'show', created_at=new Date(), updated_at, max_attempts = 1, expected_xp=10, hint, timer=null, problem_type='general', shape_constraint=null, grading_rules=null, accepts_submissions=true){
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
        this.hint               = hint
        this.timer              = timer
        this.problem_type       = problem_type
        this.shape_constraint   = shape_constraint
        this.grading_rules      = grading_rules
        this.accepts_submissions = accepts_submissions
    }

    static fromDbRoom (problemData){
        return new Problem (
            problemData.id,
            problemData.title || 'No Title',
            problemData.description,
            problemData.room_id,
            problemData.creator_id,
            problemData.expected_solution,
            problemData.difficulty,
            problemData.visibility,
            problemData.created_at,
            problemData.updated_at,
            problemData.max_attempts,
            problemData.expected_xp,
            problemData.hint,
            null,
            problemData.problem_type,
            problemData.shape_constraint,
            problemData.grading_rules,
            problemData.accepts_submissions
        );
    }

    static fromDbProbTimer (problemData, timer){
        return new Problem (
            problemData.id,
            problemData.title || 'No Title',
            problemData.description,
            problemData.room_id,
            problemData.creator_id,
            problemData.expected_solution,
            problemData.difficulty,
            problemData.visibility,
            problemData.created_at,
            problemData.updated_at,
            problemData.max_attempts,
            problemData.expected_xp,
            problemData.hint,
            timer,
            problemData.problem_type,
            problemData.shape_constraint,
            problemData.grading_rules,
            problemData.accepts_submissions
        );
    }

    toReturnTeacherDTO() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            visibility: this.visibility,
            difficulty: this.difficulty,
            max_attempts: this.max_attempts,
            timer: this.timer,
            expected_xp: this.expected_xp,
            hint: this.hint,
            expected_solution: this.expected_solution,
            problem_type: this.problem_type,
            shape_constraint: this.shape_constraint,
            grading_rules: this.grading_rules,
            accepts_submissions: this.accepts_submissions
        }
    }

    toReturnStudentDTO() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            difficulty: this.difficulty,
            max_attempts: this.max_attempts,
            expected_xp: this.expected_xp,
            hint: this.hint,
            timer: this.timer
        }
    }

    toDTO(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            visibility: this.visibility,
            expected_solution: this.expected_solution,
            difficulty: this.difficulty,
            updated_at: this.updated_at,
            max_attempts: this.max_attempts,
            expected_xp: this.expected_xp,
            hint: this.hint,
            problem_type: this.problem_type,
            shape_constraint: this.shape_constraint,
            grading_rules: this.grading_rules,
            accepts_submissions: this.accepts_submissions
        }
    }
}

module.exports = Problem