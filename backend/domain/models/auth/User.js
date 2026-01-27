class User {
    constructor(
        id, 
        firstName, 
        lastName, 
        gender, 
        phone, 
        profile_pic = 'https://uwllqanzveqanfpfnndu.supabase.co/storage/v1/object/public/profile-images/1751777126476.png',
        role = 'admin',
        email = '',
        learning_strategy = null,
        middle_initial = null){
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.middle_initial = middle_initial
        this.gender = gender
        this.phone = phone
        this.profile_pic = profile_pic
        this.role = role
        this.email = email
        this.learning_strategy = learning_strategy
    }

    static fromDbUser(dbUser){
        // Handle both user_profiles table structure and Supabase Auth structure
        return new User (
            dbUser.user_id || dbUser.id,
            dbUser.first_name || 'John',
            dbUser.last_name || 'Doe',
            dbUser.gender,
            dbUser.phone,
            dbUser.profile_pic,
            dbUser.role || 'student',
            dbUser.email || '',
            dbUser.learning_strategy || null,
            dbUser.middle_initial || null
        )
    }

    static fromInputUser(input, id, email){
        const role = input.role || 'student';
        // Randomly assign learning_strategy for students only (50/50 split)
        const learning_strategy = role === 'student' 
            ? (Math.random() < 0.5 ? 'rulebased' : 'qlearning')
            : null; // Teachers don't get a learning strategy
        
        return new User (
            id,
            input.firstName || input.first_name || 'John',
            input.lastName || input.last_name || 'Doe',
            input.gender || 'Others',
            input.phone,
            input.profile_pic || 'https://uwllqanzveqanfpfnndu.supabase.co/storage/v1/object/public/profile-images/1751777126476.png',
            role,
            email || '',
            learning_strategy,
            input.middle_initial || input.middleInitial || null
        )
    }

    toDTO(){
        return{
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            middle_initial: this.middle_initial,
            gender: this.gender,
            phone: this.phone,
            profile_pic: this.profile_pic,
            role: this.role,
            email: this.email,
            learning_strategy: this.learning_strategy
        }
    }

    addUsertoJSON(){
        return {
            first_name: this.firstName,
            last_name: this.lastName,
            middle_initial: this.middle_initial,
            gender: this.gender,
            phone: this.phone,
            profile_pic: this.profile_pic,
            role: this.role,
            learning_strategy: this.learning_strategy
        }
    }

    toJSON(){
        return {
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            middle_initial: this.middle_initial,
            gender: this.gender,
            phone: this.phone,
            profile_pic: this.profile_pic,
            role: this.role,
            email: this.email,
            learning_strategy: this.learning_strategy
        }
    }
}

module.exports = User