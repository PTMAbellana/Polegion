class Room {
    constructor(id, title, description, mantra, banner_image, user_id, created_at = new Date(), code){
        this.id = id
        this.title = title
        this.description = description
        this.mantra = mantra
        this.banner_image = banner_image
        this.user_id = user_id
        this.created_at = created_at
        this.code = code 
    }

    static fromDbRoom (roomData){
        return new Room (
            roomData.id,
            roomData.title,
            roomData.description,
            roomData.mantra,
            roomData.banner_image,
            roomData.user_id,
            roomData.created_at,
            roomData.code   
        )
    }

    toDbObject (){
        return {
            title: this.title,
            description: this.description,
            mantra: this.mantra, 
            banner_image: this.banner_image,
            user_id: this.user_id,
            code: this.code
        }
    }

    toDTO(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            mantra: this.mantra,
            banner_image: this.banner_image,
            user_id: this.user_id,
            create_at: this.create_at,
            code: this.code
        }
    }
}

module.exports = Room