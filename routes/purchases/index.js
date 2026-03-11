const express = require("express");
const router = express.Router();

router.use('/items', require('./items'))
router.use('/orders', require('./orders'))


module.exports = router