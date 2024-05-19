const utilities = require(".")
const { body, validationResult } = require("express-validator")
const valid = {}
const inventoryModel = require("../models/inventory-model")

/* ********************************************
 * Classification Validation Rules
 * ********************************************/
valid.newClassRules = () => {
    return [
        //classification_name is required and must be string
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .matches("^[A-Za-z]+$")
        .withMessage("Please provide a valid classification.") // on error this message is sent
        .custom(async (classification_name) => {
            const classExists = await inventoryModel.checkClassification(classification_name)
            if(classExists) {
                throw new Error ("Classification with that name already exists.  Please try a different name.")
            }
        }),
    ]
}

/* ******************************
 * Check data and return errors 
 * ******************************/
valid.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ********************************************
 * Inventory Validation Rules
 * ********************************************/
valid.newInvRules = () => {
    return [
        //inv_make is required and must be string
        body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid inventory make."), // on error this message is sent

        //inv_model is required and must be a string
        body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid inventory model."), // on error this message is sent

        //inv_year is required and must be 4-digit number
        body("inv_year")
        .trim()
        .isNumeric()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a valid inventory year.") // on error this message is sent
        .custom((value) => {
            const year = parseInt(value, 10)
            return year >= 1000 && year <= 9999
        }), 

        //inv_description is required and must be a string
        body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid inventory description."), // on error this message is sent

        //inv_price is required and must be a numeric value
        body("inv_price")
        .trim()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid inventory price.") // on error this message is sent
        .custom (value => {
            const price = parseFloat(value)
            return price > 0 && price < 1000000
        }),

        //inv_miles is required and must be a numeric value
        body("inv_miles")
        .trim()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide valid inventory mileage.") // on error this message is sent
        .custom(value => {
            const miles = parseInt(value)
            return miles > 0 && miles < 1000000
        }),

        //inv_color is required and must be a string
        body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid inventory color."), // on error this message is sent

        //classification_id is required and must be selected
        body("classification_id")
        .not()
        .isEmpty()
        .withMessage("You must select a valid inventory classification.") // on error this message is sent
    ]
}

/* ******************************
 * Check classification data and return errors 
 * ******************************/
valid.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ******************************
 * Check inventory data and return errors 
 * ******************************/
valid.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-inventory", {
            errors,
            title: "New Inventory",
            nav,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image,
            inv_thumbnail,
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
        })
        return
    } else {
        valid.validateData = async (req, res, next) => {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
        }

    }
    next()
}

module.exports = valid