var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");

router.get("/sign-up", userController.sign_up_get);
router.post('/sign-up', userController.sign_up_post);
router.get('/sign-in', userController.sign_in_get);
router.post('/sign-in', userController.sign_in_post);
router.get('/log-out', userController.log_out_get);

module.exports = router;
