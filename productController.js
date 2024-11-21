const products = require('./../Models/productModel')
const { validationResult } = require('express-validator')
// const Todo = require('./../Models/TodoSchema')
const loggerServices = require('./../Service/logger.services')


const logger = new loggerServices("product")



























exports.GetAllTodo = async (request, response) => {
    products.find({}).then((data) => {
        // logger.info("list of products")
        response.status(200).json({ message: 'products list', data })
    })
        .catch((error) => {
            throw new Error('New error: ' + error)
        })
}
exports.AddTodo = (request, response, next) => {
    let errors = validationResult(request)
    if (errors.isEmpty()) {
        let prod = new products({
            name: request.body.name,
            description: request.body.description,
            category: request.body.category,
            price: request.body.price,
            sizeOptionOne: request.body.sizeOptionOne,
            sizeOptionTwo: request.body.sizeOptionTwo,
            sizeOptionThree: request.body.sizeOptionThree,
            image: request.file.filename
        })
        prod.save().then(data => {
            logger.info('product added', { prod })
            response.status(200).redirect("http://localhost:3000/Admin-UpdateDelete")
            // response.status(200).json({ message: 'added', data })
        }).catch(error => next(error))
    } else if (!errors.isEmpty()) {
        let myError = errors.array().reduce((current, object) => current + object.msg + "\n", "")
        response.status(422).json({ myError })
    }
}
exports.UpdateTodo = (request, response, next) => {
    // console.log(request.body,request.params)

    products.findByIdAndUpdate({ _id: request.params.id }, {
        $set: {
            name: request.body.name,
            description: request.body.description,
            category: request.body.category,
            price: request.body.price
        }
    }).then((data) => {
        console.log(data)
        if (data == null) {

            throw new Error('product not found!!')
        }
        else {
            logger.info('product updated', { data })
            response.status(200).json({ message: 'updated', data })
        }

    }).catch((error) => {
        let message = error.message
        logger.error(message)
        next(error)
    })

}
exports.DeleteTodo = (request, response, next) => {
    let stdid = request.body.id || request.params.id
    products.findByIdAndDelete(stdid).then((data) => {
        if (data == null) {
            logger.error("Product not Found", data);
            throw new Error('product not found!!')
        }
        else {

            logger.info("Product Deleted", data);
            response.status(200).json({ message: 'deleted', data })
        }

    }).catch((error) => {
        next(error)
    })

}
