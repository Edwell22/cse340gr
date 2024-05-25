const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ******************************
 * Build inventory by classification view
 * ****************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    // console.log(className)
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid
    })
}

/* ********************************
 * Build inventory by single vehicle view
 * ******************************** */
invCont.buildByVehicleId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const response = await invModel.getInventoryByInventoryId(inv_id)
    const buildArea = await utilities.buildVehicleInfo(response)
    let nav = await utilities.getNav()
    const vehicleName = response[0].inv_year + ' ' + response[0].inv_make + ' ' + response[0].inv_model
    // console.log(vehicleName)
    res.render("./inventory/inventory", {
        title: vehicleName,
        nav,
        buildArea
    })
}

/* **************************
 * Deliver management view
 * **************************/
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let newClass = await utilities.buildNewClassView()
    let addCar = await utilities.buildNewCarView()
    const classificationSelect = await utilities.getFormSelections()
    console.log(classificationSelect)
    res.render("./inventory/", {
        title: "Management - Inventory Control",
        nav,
        newClass,
        addCar,
        errors: null,
        classificationSelect,
    })
}

/* **************************
 * Deliver classification management view
 * **************************/
invCont.buildClassManageView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash()
    res.render("./inventory/add-classification", {
        title: "New Classification",
        nav,
        errors: null,
    })
}

/* **************************
 * Deliver inventory management view
 * **************************/
invCont.buildInvManageView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let carClass = await utilities.getFormSelections()
    req.flash()
    res.render("./inventory/add-inventory", {
        title: "New Inventory",
        nav,
        carClass,
        errors: null,
    })
}

/* ****************************
 * Create new vehicle classification 
 * ****************************/
invCont.createNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    let newClass = await utilities.buildNewClassView()
    let addCar = await utilities.buildNewCarView()
    
    const {classification_name} = req.body

    const regResult = await invModel.createNewClassification(
        classification_name
    )

    if (regResult) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `${classification_name} has been added.`
        )
        res.status(201).render("./inventory/", {
            title: "Management - New Inventory",
            nav,
            newClass,
            addCar,
            errors: null,     
        })
    } else {
        req.flash("notice", "Sorry, classifiction not added. Please try again.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    }
}

/* ****************************
 * Create new vehicle inventory 
 * ****************************/
invCont.createNewInventory = async function (req, res, next) {
    let nav = await utilities.getNav()

    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body

    console.log(req.body)
    
    const regResult = await invModel.createNewInventory(
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    )

    console.log(regResult)

    if (regResult) {
        let nav = await utilities.getNav()
        let newClass = await utilities.buildNewClassView()
        let addCar = await utilities.buildNewCarView()
        req.flash(
            "notice",
            `${inv_year} ${inv_make} ${inv_model} has been added.`
        )
        res.status(201).render("./inventory/", {
            title: "Management - New Inventory",
            nav,
            newClass,
            addCar,
            errors: null,
        })
    } else  {
        req.flash("notice", "Sorry, inventory not added. Please try again.")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            errors: null,
        })
    }
}

/* ***************************
 * Return Inventory by Classification As JSON
 * *************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if(invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont
