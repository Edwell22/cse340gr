// Needed resources
const express = require ("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const errorController = require("../controllers/errorController")
const invValid = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by single vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByVehicleId));

// Route to generate an intentional error process
router.get("/error", utilities.handleErrors(errorController.generateError))

// Route to get to management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to get to classification management view
router.get("/add-classification", utilities.handleErrors(invController.buildClassManageView))

// Route to get to inventory management view
router.get("/add-inventory", utilities.handleErrors(invController.buildInvManageView))

// Route to add new vehicle classification
router.post("/add-classification", 
invValid.newClassRules(),
invValid.checkClassData, 
utilities.handleErrors(invController.createNewClassification))

// Route to add new vehicle inventory
router.post("/add-inventory", 
invValid.newInvRules(),
invValid.checkInvData,
utilities.handleErrors(invController.createNewInventory))

module.exports = router