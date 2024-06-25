const Book = require("../schemas/book.schema");
const User = require("../schemas/user.schema");
const Favourate = require("../schemas/favourate.schema")

let service={};

service.addFavourateBook = addFavourateBook
service.deleteFavourateBook = deleteFavourateBook
service.getAllFavourate = getAllFavourate

async function addFavourateBook(userId, bookId){
    try {
        const existingFavourate = await Favourate.findOne({
            user: userId,
            book: bookId
        })
        if(existingFavourate){
            return Promise.reject("Already added to Favourate")
        }
        const data = await Favourate.create({
            user: userId,
            book: bookId
        })
        return data
    } catch (error) {
        console.log("Error adding favourate book", error)
        Promise.reject("Error adding favourate book")
    }
}

async function deleteFavourateBook(id){
    try {
        const data = await Favourate.findOneAndDelete({_id: id})
        return data
    } catch (error) {
        console.log("Error adding favourate book", error)
        return Promise.reject("Error adding favourate book")
    }
}

async function getAllFavourate(id){
    try {
        const data = await Favourate.find({user: id}).populate('book').sort({createdAt: -1})
        return data
    } catch (error) {
        console.log("Error adding favourate book", error)
        return Promise.reject("Error adding favourate book")
    }
}

module.exports = service