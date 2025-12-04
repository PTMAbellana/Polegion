class User {
    constructor(
        id, 
        firstName, 
        lastName, 
        gender, 
        phone, 
        profile_pic = 'https://uwllqanzveqanfpfnndu.supabase.co/storage/v1/object/public/profile-images/1751777126476.png',
        role = 'admin',
        email = ''){
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.gender = gender
        this.phone = phone
        this.profile_pic = profile_pic
        this.role = role
        this.email = email
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
            dbUser.email || ''
        )
    }

    static fromInputUser(input, id, email){
        return new User (
            id,
            input.firstName || input.first_name || 'John',
            input.lastName || input.last_name || 'Doe',
            input.gender || 'Others',
            input.phone,
            input.profile_pic || 'https://uwllqanzveqanfpfnndu.supabase.co/storage/v1/object/public/profile-images/1751777126476.png',
            input.role || 'student',
            email || ''
        )
    }

    toDTO(){
        return{
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            gender: this.gender,
            phone: this.phone,
            profile_pic: this.profile_pic,
            role: this.role,
            email: this.email
        }
    }

    addUsertoJSON(){
        return {
            first_name: this.firstName,
            last_name: this.lastName,
            gender: this.gender,
            phone: this.phone,
            profile_pic: this.profile_pic,
            role: this.role,
        }
    }

    toJSON(){
        return {
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            gender: this.gender,
            phone: this.phone,
            profile_pic: this.profile_pic,
            role: this.role,
            email: this.email
        }
    }
}

module.exports = User