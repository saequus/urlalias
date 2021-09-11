const express = require('express');
const router = express.Router();
const statsMiddleware = require('../middleware/stats');
const { redirectByAlias, allUrlAliases, mainpage } = require('../controller');

router.get('/all-urls', statsMiddleware('all_urls'), allUrlAliases);
router.get('/:from', statsMiddleware('redirect_alias'), redirectByAlias);
router.get('/', statsMiddleware('mainpage'), mainpage);

module.exports = router;
