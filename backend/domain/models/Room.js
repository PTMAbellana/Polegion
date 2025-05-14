class Room {
    constructor(id, title, description, mantra, bannerImage, userId, createAt = new Date()){
        this.id = id
        this.title = title
        this.description = description
        this.mantra = mantra
        this.bannerImage = bannerImage
        this.userId = userId
        this.createAt = createAt
    }

    static fromDbRoom (roomData){
        return new Room (
            roomData.id,
            roomData.title,
            roomData.description,
            roomData.mantra,
            roomData.bannerImage,
            roomData.userId,
            roomData.createAt   
        )
    }

    toDbObject (){
        return {
            title: this.title,
            description: this.description,
            mantra: this.mantra, 
            bannerImage: this.bannerImage,
            userId: this.userId
        }
    }

    toDTO(){
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            mantra: this.mantra,
            bannerImage: this.bannerImage,
            userId: this.userId,
            createAt: this.createAt
        }
    }
}

module.exports = Room