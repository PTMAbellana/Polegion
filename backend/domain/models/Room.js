class Room {
    constructor(id, title, description, mantra, banner_image, userId, create_at = new Date(), code, visibility = 'public'){
        this.id = id
        this.title = title
        this.description = description
        this.mantra = mantra
        this.banner_image = banner_image
        this.userId = userId
        this.create_at = create_at
        this.code = code
        this.visibility = visibility
    }

    static fromDbRoom (roomData){
        return new Room (
            roomData.id,
            roomData.title,
            roomData.description,
            roomData.mantra,
            roomData.banner_image,
            roomData.userId,
            roomData.create_at,
            roomData.code,
            roomData.visibility   
        )
    }

    toDbObject (){
        return {
            title: this.title,
            description: this.description,
            mantra: this.mantra, 
            banner_image: this.banner_image,
            userId: this.userId,
            code: this.code,
            visibility: this.visibility
        }
    }

    toDTO(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            mantra: this.mantra,
            banner_image: this.banner_image,
            userId: this.userId,
            create_at: this.create_at,
            code: this.code,
            visibility: this.visibility
        }
    }
}

module.exports = Room