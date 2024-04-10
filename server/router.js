const express = require('express');
const router = express.Router();
const indexRouter = require('./index');

router.use('/index', indexRouter);

module.exports = router;
