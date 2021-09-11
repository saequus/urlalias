const dbCon = require('../db');

function redirectByAlias(req, res) {
  dbCon.UrlAlias.findOne()
    .usingFrom(req.params.from)
    .exec((err, alias) => {
      if (alias) {
        res.redirect(alias.to);
        return Promise.resolve();
      }
    });
}

function allUrlAliases(req, res) {
  const urls = dbCon.getAllUrls();
  res.send(urls);
}

function mainpage(req, res) {
  res.send('Mainpage');
}

module.exports = {
  redirectByAlias,
  allUrlAliases,
  mainpage,
};
