const { request, response } = require('express')
const users = require('../Models/userModel')
const loggerServices = require('./../Service/logger.services')

const logger = new loggerServices("Sign Up")

// exports.getSignup = (request, response, next) => {
//     response.render('signup')
// }

exports.getAllUsers = (request, response, next) => {
    users.find({}).then(data => {
        response.status(200).json({ data })
    }).catch(error => {
        next(error)
    })
}


exports.addUser = (request, response, next) => {
    let user = new users({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password
    })
    user.save().then(data => {
        if (!data) {

            logger.error("Email or Password Incorrect ", user);
            response.status(200).JSON({ message: 'Please Enter your Registration Data' })
        }
        logger.info("User Logged In ", user);
        response.status(201).json({ user })
    }).catch(error => {
        let message = error.message;
        message.includes("duplicate key error")
            ? (message = "Email is already used")
            : (message = "Please Enter your Registration Data")
        logger.error("Email is already used ", user);
        response.status(400).json({ message });
    }
    )
}




