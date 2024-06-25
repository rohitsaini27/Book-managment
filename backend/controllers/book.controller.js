const express = require('express')
const router = express.Router()

const BookService = require("../services/book.service")
const Book = require('../schemas/book.schema')

router.post("/:id", (req,res) => {
    BookService.createBook(req.params.id, req.body).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

router.put("/:id", (req,res) => {
    BookService.updateBook(req.params.id, req.body).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

router.delete("/:id", async (req,res) => {
    try {
        await Book.findOneAndDelete({_id:req.params.id})
        res.status(200).send("Book deleted")
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.get("/", (req,res) => {
    BookService.getAllBooks().then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// get books limit to 4
router.get("/limit", async (req,res) => {
    try {
        const data = await Book.find().sort({ createdAt : -1}).limit(4)
        res.status(200).send(data)
    } catch (error) {
        console.error("Error getting book:", error);
        res.status(400).send(error)
    }
})

// get book by id
router.get("/:id", async (req,res) => {
    try {
        const data = await Book.findOne({_id: req.params.id})
        res.status(200).send(data)
    } catch (error) {
        console.error("Error getting book:", error);
        res.status(400).send(error)
    }
})
module.exports = router