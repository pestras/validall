const to = {
  lowercase: (value) => value.toLowerCase(),
  uppercase: (value) => value.toUpperCase(),
  capitlizeFirst: (value) => value.charAt(0).toUpperCase() + value.slice(1),
  capitlizeFirstAll: (value) => value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  trim: (value) => value.trim().replace(/\s{2,}/g, ' '),
  path: (path) => path.trim().replace(/\/$/, "").replace(/\/{2,}/g, "/").replace(/(\w+)\/\.\./g, "$1")
};

module.exports = to;