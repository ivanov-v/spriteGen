const fs = require('fs-extra');

function mkdir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      resolve();
    });
  });
}

module.exports = mkdir;
