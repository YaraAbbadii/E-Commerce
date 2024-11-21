const placeorder = require("../Models/cartModel")
const loggerServices = require('./../Service/logger.services')
const { validationResult } = require("express-validator")

const logger = new loggerServices("Cart")



// Get All Cart Data
exports.getOrderData = (request, response, next) => {
    placeorder.find({}).then(data => {
        logger.info("Get Order Data  ", data);
        response.status(200).json(data)
    }).catch(error => {
        next(error)
    })
}


//Post product data
exports.postCart = (request, response, next) => {
    let errors = validationResult(request)
    if (errors.isEmpty()) {
        let order = new placeorder({
            cartOrder: request.body.cartOrder,
            sizeOrder: request.body.sizeOrder,
            email: request.body.email,
            address: request.body.address,

        })
        order.save().then(data => {
            logger.info("Send Order Data  ", data);
            response.status(200).json({ cartOrder: data })
            // response.redirect('/')
        }).catch(error => next(error))
    } else if (!errors.isEmpty()) {
        let myError = errors.array().reduce((current, object) => current + object.msg + "\n", "")
        logger.error("Error in Order Data  ", data);
        response.status(422).json({ myError })
    }

}