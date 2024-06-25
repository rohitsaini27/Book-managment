const express = require('express')
const router = express.Router()
const FavourateService = require('../services/favourate.service')
const authVerification = require('../middleware/auth.middleware')

router.post("/", authVerification, (req,res) => {
    const { userId, bookId} = req.body
    FavourateService.addFavourateBook(userId, bookId).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

router.delete("/:id", authVerification, (req,res) => {
    FavourateService.deleteFavourateBook(req.params.id).then((response) => {
        res.status(200).send("Book Removed Succesfully")
    }).catch((error) => {
        res.status(500).send(error)
    })
})

router.get("/:id", (req,res) => {
    FavourateService.getAllFavourate(req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

module.exports = router