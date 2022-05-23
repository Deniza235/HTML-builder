const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');


async function buildPage() {
  await fsPromise.rm(path.join(__dirname, 'project-dist'), {recursive:true, force:true});
  await fsPromise.mkdir(path.join(__dirname, 'project-dist'), {recursive:true});
  await createHtml();
  await createCss();
  await createAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

async function createHtml() {
  let readTemplate = await fsPromise.readFile(path.join(__dirname, 'template.html'), {encoding: 'utf8'});
  fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, async (err, files) => {
    if (err) throw err;
    const components = files.filter(el => el.isFile());
    let infoComponents = {};
    for(let component of components) {
      const componentExt = path.parse(path.join(__dirname, 'components', component.name));
      if(componentExt.ext === '.html') {
        let files = await fsPromise.readFile(path.join(__dirname, 'components', component.name), {encoding: 'utf8'});
        infoComponents[componentExt.name] = files;
      }
    }
    while(readTemplate.indexOf('{{') !== -1) {
      readTemplate = readTemplate.replace(readTemplate.slice(readTemplate.indexOf('{{'), readTemplate.indexOf('}}') + 2), infoComponents[readTemplate.slice(readTemplate.indexOf('{{') + 2, readTemplate.indexOf('}}'))]);
    }
    await fsPromise.writeFile(path.join(__dirname, 'project-dist', 'index.html'), readTemplate);
  })
}

async function createCss() {
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    const curFiles = files.filter(el => el.isFile());
    curFiles.reverse();
    curFiles.forEach(el => {
      const infoFile = path.parse(path.join(__dirname, 'styles', el.name));
      if(infoFile.ext === '.css') {
        const readStream = fs.createReadStream(path.join(__dirname, 'styles', el.name));
        readStream.pipe(writeStream);
      }
    })
  })
}

async function createAssets(curPath, copyPath) {
  await fsPromise.mkdir(copyPath, {recursive: true, force: true});
    const files = await fsPromise.readdir(curPath, {withFileTypes: true});
    for(let file of files) {
      if(file.isFile()) {
        await fsPromise.copyFile(path.join(curPath, file.name), path.join(copyPath, file.name));
      } else {
        await createAssets(path.join(curPath, file.name), path.join(copyPath, file.name));
      }
    }
}

buildPage();
