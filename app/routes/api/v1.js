

const express = require('express');
const router = express.Router();
const statsMiddleware = require('../../middleware/stats');
const { createURLAlias, getAliases } = require('../../controller')


router.use('/urls', statsMiddleware('api_v1_urls'), getAliases);
// router.get('/url', statsMiddleware('api_v1_url'), createURLAlias);
router.post('/url', statsMiddleware('api_v1_url'), createURLAlias);


module.exports = router;


