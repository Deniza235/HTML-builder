const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  const currentFiles = files.filter(el => el.isFile());
  currentFiles.forEach(el => {
    const infoFiles = path.parse(path.join(__dirname, 'secret-folder', el.name));
    let nameFiles = infoFiles.name;
    let extensionFiles = infoFiles.ext.slice(1);
    fs.stat(path.join(__dirname, 'secret-folder', el.name), (err, stats) => {
      if (err) throw err;
      let size = (stats.size / 1024).toFixed(3);
      stdout.write(`${nameFiles} - ${extensionFiles} - ${size}kb\n`);
    });
  })
});