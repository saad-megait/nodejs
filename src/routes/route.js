const express = require('express')
const {addUserType, getUserType, getUserTypeModulesPermission} = require('../controllers/UserTypeController.js')
const route = express.Router()

route.post('/add/user-type', addUserType).get('/user-type', getUserType).get('/user-type/view/:id', getUserTypeModulesPermission)

module.exports = {route}