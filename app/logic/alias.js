function buildSlug(limit) {
  if (!limit) limit = 7;
  let a = '';
  for (let i = 0; i < limit; i++) {
    if (i % 2 == 0) {
      a += String.fromCharCode(parseInt(65 + Math.random() * (90 - 65)));
    } else {
      a += String.fromCharCode(parseInt(97 + Math.random() * (122 - 97)));
    }
  }
  return a;
}

module.exports = {
  buildSlug,
};
