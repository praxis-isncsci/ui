// 👇️ if using ES6 imports uncomment next line
// import {readFile, writeFile, writeFileSync, promises as fsPromises} from 'fs';
// import {getAppLayoutTemplate} from '../build/scripts/bundle.js';
const { readFile, writeFile } = require('fs');
const { getAppLayoutTemplate } = require('../build/scripts/appLayoutTemplate.js');

console.log('replacing text in file...');

readFile('./build/index.html', 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }

  const replaced = contents.replace(
    /{{app-template}}/g,
    getAppLayoutTemplate('', 'icons/', false, true),
  );

  writeFile('./build/index.html', replaced, 'utf-8', function (err) {
    console.log(err);
  });
});
