const express = require('express');
const router = express.Router();
const statsMiddleware = require('../middleware/stats');
const {
  redirectUsingSlug,
  mainpage,
  createURLAliasFromSource,
} = require('../controller');

router.post('/new', statsMiddleware('new'), createURLAliasFromSource);
router.get('/:slug', statsMiddleware('redirect_alias'), redirectUsingSlug);
router.get('/', statsMiddleware('mainpage'), mainpage);

module.exports = router;
