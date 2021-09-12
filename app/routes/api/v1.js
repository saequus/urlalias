const express = require('express');
const router = express.Router();
const statsMiddleware = require('../../middleware/stats');
const {
  createURLAlias,
  createURLAliasFromSource,
  getAliases,
} = require('../../controller');

router.use('/urls', statsMiddleware('api_v1_urls'), getAliases);
// router.get('/url', statsMiddleware('api_v1_url'), createURLAlias);
router.post('/url', statsMiddleware('api_v1_url'), createURLAlias);
router.post('/url-by-source', async (req, res, next) => {
  async function run() {
    await createURLAliasFromSource(req, res);
  }

  run().catch(next);
});

module.exports = router;
