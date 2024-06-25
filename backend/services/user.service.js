const nodemailer = require("nodemailer");
const PasswordService = require('../services/password.service');
const User = require("../schemas/user.schema");

let service={};

service.userRegistration = userRegistration
service.generateOtp = generateOtp;
service.userSave = userSave;
service.getUserData = getUserData;
service.verifyLogin = verifyLogin;
service.userUpdate = userUpdate

async function userRegistration(body){ 
    try {
        const existingUser = await User.findOne({email: body.email});
        if (existingUser){
            return Promise.reject("Account already exists!");
        }else{
            const encryptedPassword = PasswordService.passwordEncryption(body.password);
            body.password = encryptedPassword;
            body.isActive = true;
            const user = await User.create(body);
            return user;
        }
    } catch (error) {
        return Promise.reject("Unable to create User")
    }
}

// GENERATES OTP FOR EMAIL VERIFICATION
async function generateOtp(body) {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
    
        const emailtemplate = `
        <html>
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
            }
            .title {
                color: #fff;
                font-weight: bold;
                font-family: 'Arial Black', sans-serif;
                font-size: 24px;
                margin-bottom: 10px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: #9a1c3f;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                text-align: center;
                color: #fff;
            }
            .otp-content {
                background-color: #e99e7a;
                color: #071e43;
                padding: 10px;
                border-radius: 5px;
                margin-top: 20px;
            }
        </style>
        </head>
        <body>
            <div class="container">
            <h1 class="title">OTP Verification</h1>
            <div class="otp-content">
                <strong>Your One Time is Password:</strong> ${otp}
            </div>
        </div>
        </body>
        </html>
        `;
        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.GOOGLE_MAIL,
            pass: process.env.GOOGLE_PASS,
            },
        });
        // Define email content
        const mailOptions = {
            from: process.env.GOOGLE_MAIL,
            to: body.email,
            subject: "OTP Verification",
            html: emailtemplate,
        };
    
        // Send email
        await transporter.sendMail(mailOptions);
        return {
            id: body._id,
            otp: otp
        };
    } catch (error) {
        return Promise.reject("Error sending otp");
    }
}

// SAVES USER
async function userSave(id){ 
    try {
        await User.findOneAndUpdate({_id: id}, {isActive: true}, {new: true});
        return true;
    } catch (error) {
        return Promise.reject("Unable to create User")
    }
}

//FETCHES SINGLE USER DATA
async function getUserData(id){ 
    console.log(id, "id")
    try {
        const user = await User.findOne({_id: id}).select("-password");
        console.log(user)
        return user;
    } catch (error) {
        return Promise.reject("Error fetching user data")
    }
}

// VERIFIES LOGIN DETAILS
async function verifyLogin(email, password) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return Promise.reject("Account not found!");
        }else{
            if (user.isActive){
                const decryptedPassword = await PasswordService.passwordDecryption(user.password);
                if (decryptedPassword === password) {
                    const userData  = await User.findOne({ _id: user._id }).select("-password").populate("role");
                    return userData;
                } else {
                    return Promise.reject("Incorrect Password");
                }
            }else{
                return Promise.reject("Account not activated!");
            }
        }
    } catch (err) {
        return Promise.reject("Login failed! Try again later!");
    }
}

async function userUpdate(id, body){
    console.log(body)
    try {
        const data = await User.findOneAndUpdate({_id:id}, body, {new:true})
        return data
    } catch (error) {
        return Promise.reject("Error updateing user data")
    }
}

module.exports = service