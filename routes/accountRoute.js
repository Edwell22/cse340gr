// Needed resources
const express = require ("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build the login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to register a new user
router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to the account management view
router.get(
    "/", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildAccountMgmtView)
)

// Route for getting the account update form
router.get("/accounts/update/:account_id", utilities.handleErrors(accountController.getUpdateAccountForm))

// Route for processing the account update form
router.post(
    "/accounts/update/", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.updateAccount))

// Route for logout
router.get("/logout",utilities.handleErrors(accountController.logoutToken))

module.exports = router