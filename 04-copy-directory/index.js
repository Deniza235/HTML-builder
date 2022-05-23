  const fsPromise = require('fs/promises');
  const path = require('path');

  async function copyDir() {
    await fsPromise.rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true});
    copyFolder(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
  }

  async function copyFolder(curPath, copyPath) {
    await fsPromise.mkdir(copyPath, {recursive: true});
    const files = await fsPromise.readdir(curPath, {withFileTypes: true});
    for(let file of files) {
      if(file.isFile()) {
        await fsPromise.copyFile(path.join(curPath, file.name), path.join(copyPath, file.name));
      } else {
        copyFolder(path.join(curPath, file.name), path.join(copyPath, file.name));
      }
    }
  }

  copyDir();
