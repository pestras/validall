function filter(src, keys) {
  let srcKeys = Object.keys(src);

  for (let i = 0; i < srcKeys.length; i++)
    if (keys.indexOf(srcKeys[i]) === -1)
      delete src[srcKeys[i]];
}

module.exports = filter;