const fs = require('fs-extra');

function mkdir(path) {
  fs.mkdir(path, (err) => {

  });
}

module.exports = mkdir;
