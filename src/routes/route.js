const express = require('express')
const {addUserType, getUserType, getUserTypeModulesPermission, updateUserTypeModulesPermission} = require('../controllers/UserTypeController.js')
const route = express.Router()

route.post('/add/user-type', addUserType).get('/user-type', getUserType).get('/user-type/view/:id', getUserTypeModulesPermission).put('/admin/user-type/update/:id', updateUserTypeModulesPermission)

module.exports = {route}