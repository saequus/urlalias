const express = require('express');
const router = express.Router();
const statsMiddleware = require('../middleware/stats');
const { redirectUsingAlias, getAliases, mainpage } = require('../controller');

router.get('/:from', statsMiddleware('redirect_alias'), redirectUsingAlias);
router.get('/', statsMiddleware('mainpage'), mainpage);

module.exports = router;
