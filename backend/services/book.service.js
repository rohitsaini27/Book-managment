const Book = require("../schemas/book.schema");
const User = require("../schemas/user.schema");

let service={};

service.createBook = createBook
service.updateBook = updateBook
service.getAllBooks = getAllBooks

async function createBook(id, body) {
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return Promise.reject("User not found");
        }
        if (user.role !== "admin") {
            return Promise.reject("You don't have access to create Books");
        }
        const data = await Book.create(body);
        return data;
    } catch (error) {
        console.error("Error creating book:", error);
        return Promise.reject("Error creating book");
    }
}

async function updateBook(id, body){
    try {
        const data = await Book.findOneAndUpdate({_id: id}, body, {new: true})
        return data
    } catch (error) {
        console.error("Error creating book:", error);
        return Promise.reject("Error creating book");
    }
}

async function getAllBooks(){
    try {
        const data = await Book.find().sort({ createdAt : -1})
        return data
    } catch (error) {
        console.error("Error getting book:", error);
        return Promise.reject("Error getting book");
    }
}

module.exports = service