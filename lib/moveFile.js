const fs = require('fs-extra');

function moveFile(from, to) {
  return new Promise((resolve, reject) => {
    fs.move(from, to, () => {
      resolve();
    });
  });
}

module.exports = moveFile;
