const { request } = require("express")
const contact = require("../Models/contactModel.js")
const loggerServices = require('./../Service/logger.services')

const { validationResult } = require("express-validator")
const logger = new loggerServices("Contact")


// Get Contact Messages
// exports.get = (request, response, next) => {
//     if (request.role == 'admin') {
//         response.render('admin')
//     } else {
//         throw new Error('Not Authorized')
//     }
// }


exports.getAllMessages = (request, response, next) => {
    contact.find({}).then(data => {
        logger.info("Get All Messages  ", data);
        response.status(200).json({ data })
    }).catch(error => {
        next(error)
    })
}

//Post Contact data
exports.postContact = (request, response, next) => {
    let errors = validationResult(request)
    if (errors.isEmpty()) {
        let contactMess = new contact({
            userName: request.body.userName,
            email: request.body.email,
            title: request.body.title,
            message: request.body.message
        })
        contactMess.save().then(data => {
            logger.info("Send Message Details", data);
            response.status(200).json("Message Successfully Sent")
            // response.redirect('/')
        }).catch(error => next(error))
    } else if (!errors.isEmpty()) {
        logger.error("Error Message Data", data);
        let myError = errors.array().reduce((current, object) => current + object.msg + "\n", "")
        response.status(422).json({ myError })
    }

}