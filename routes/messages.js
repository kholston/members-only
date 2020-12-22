const express = require('express');
const router = express.Router();
const message_controller = require('../controllers/messageController');

router.get('/', message_controller.index);
router.get('/create', message_controller.message_create_get);
router.post('/create', message_controller.message_create_post);
router.get('/message/:id', message_controller.message_delete_get);
router.post('/message/:id', message_controller.message_delete_post);

module.exports = router;
