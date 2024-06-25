const express = require('express')
const router = express.Router()
const UserService = require('../services/user.service')
const User = require('../schemas/user.schema')
const authVerification = require('../middleware/auth.middleware');
const Users = require('../schemas/user.schema');
const { createSecretToken } = require('../utils/secretToken');

// CREATES NEW USER AND SENDS OTP TO EMAIL
router.post("/", (req, res) => {
    UserService.userRegistration(req.body).then(response => {
        UserService.generateOtp(response).then(response => {
            res.status(200).send(response);
        }).catch(error => {
            console.log("register error", error);
            res.status(500).send(error);
        })
    }).catch(error => {
        console.log("register error", error);
        res.status(500).send(error);
    })
});

// SAVES NEW USER AND MARK IT ACTIVE
router.post("/save/:id", (req, res) => {
    UserService.userSave(req.params.id).then(response => {
        res.status(200).send("OK");
    }).catch(error => {
        console.log("SAVE error", error);
        res.status(500).send(error);
    })
});

// LOGIN THE USER
router.post("/login", (req, res) => {
    const {email, password} = req.body;
    console.log(req.body , "body")
    UserService.verifyLogin(email, password).then(async (response) => {
        try {
            const token = createSecretToken(response._id);
            res.status(200).send({user:response, token:token});
        } catch (error) {
            console.log("first error", error);
            res.status(400).send(error);
        }
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get("/:id", authVerification, (req,res) => {
    const id = req.params.id
    UserService.getUserData(id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

router.put('/:id', authVerification, (req,res) => {
    UserService.userUpdate(req.params.id, req.body).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

module.exports = router