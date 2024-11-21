const users = require('../Models/userModel')
const jwt = require('jsonwebtoken');
const loggerServices = require('./../Service/logger.services')
const logger = new loggerServices("Login")

// Login
exports.login = (request, response, next) => {
    users.findOne({ email: request.body.email })
        .then(data => {
            if (!data || data.password != request.body.password) {
                logger.error("Incorrect Data", data);
                response.status(200).json({ message: 'Email or Password Incorrect' })
            }
            else if (data.email == "admin@gmail.com") {
                let token = jwt.sign({
                    email: data.email,
                    role: "admin"
                }, process.env.SECRET_KEY, { expiresIn: '1hr' })
                console.log(token)
                response.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 3600 * 1000
                })
                logger.info("Admin Logged In ", data);
                response.status(201).json({ role: "admin", token: token, username: data.username })
                // response.redirect('/admin')
            } else {

                let token = jwt.sign({
                    email: data.email,
                    username: data.username,
                    role: "user"
                }, process.env.SECRET_KEY, { expiresIn: '1hr' })
                response.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 3600 * 1000
                })
                logger.info("User Logged In ", data);
                response.status(201).json({ role: "user", token: token, username: data.username, email: data.email })
                // response.redirect('/home')
            }
        }).catch(error => next(error))
}