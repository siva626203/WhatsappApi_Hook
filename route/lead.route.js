const express = require('express');
const leadController = require('../controller/lead.controller'); // Adjust path as needed

const router = express.Router();

router.get('/get', leadController.lead_get);
router.get('/post', leadController.lead_create);
// router.post('/send_message', leadController.send_message);

module.exports = router;
