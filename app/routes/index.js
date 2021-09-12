const express = require('express');
const router = express.Router();
const statsMiddleware = require('../middleware/stats');
const {
  mainpage,
  newAlias,
  newAliasFromSource,
  redirectUsingSlug,
  showLatest,
} = require('../controller');

router.post('/new', statsMiddleware('new'), newAliasFromSource);
router.post('/latest', statsMiddleware('last'), showLatest);
router.get('/:slug', statsMiddleware('redirect_alias'), redirectUsingSlug);
router.get('/', statsMiddleware('mainpage'), mainpage);

module.exports = router;
