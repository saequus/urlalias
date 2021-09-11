module.exports = function statsMiddleware(urlName) {
  return (req, res, next) => {
    const startTime = new Date().getTime();

    res.once('finish', sendStats);
    res.once('error', cleanup);
    res.once('close', cleanup);

    return next();

    function sendStats() {
      const duration = new Date().getTime() - startTime;
      // send duration with urlName to stats server
      cleanup();
    }

    function cleanup() {
      res.removeListener('finish', sendStats);
      res.removeListener('error', cleanup);
      res.removeListener('close', cleanup);
    }
  };
};
