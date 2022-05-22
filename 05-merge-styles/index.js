const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  const curFiles = files.filter(el => el.isFile());
  curFiles.forEach(el => {
    const infoFile = path.parse(path.join(__dirname, 'styles', el.name));
    if(infoFile.ext === '.css') {
      const readStream = fs.createReadStream(path.join(__dirname, 'styles', el.name));
      readStream.pipe(writeStream);
    }
  })
})