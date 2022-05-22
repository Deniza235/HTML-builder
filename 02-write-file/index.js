const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const document = fs.createWriteStream(path.join(__dirname, 'note.txt'));

stdout.write('Здравствуйте! Введите текст.\n');
stdin.on('data', chunk => {
  const textToString = chunk.toString();
  if ( textToString.trim() === 'exit') {
    stdout.write('До свидания!');
    process.exit();
  } else {
    document.write(chunk);
  }
})

process.on('SIGINT', () => {
  stdout.write('До свидания!');
  process.exit();
})
