var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.get('/sign-up', userController.sign_up_get);
router.post('/sign-up', userController.sign_up_post);
router.get('/sign-in', userController.sign_in_get);
router.post('/sign-in', userController.sign_in_post);
router.get('/log-out', userController.log_out_get);

router.get('/profile', userController.user_profile_get);
router.get(
  '/membership-upgrade',
  userController.upgrade_membership_get,
);
router.post(
  '/membership-upgrade',
  userController.upgrade_membership_post,
);

router.get('/admin', userController.admin_form_get);
router.post('/admin', userController.admin_form_post);

module.exports = router;
